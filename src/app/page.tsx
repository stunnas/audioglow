'use client'
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { throttle } from "lodash";
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Song, QueueItem } from "@/components/interfaces/song";
import { Visualizer } from "@/components/types/visualizer";
import SortableItem from "@/components/ui/sortableItem";
import NavBar from "@/components/sections/navbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AudioVisualizer from "@/components/sections/visualizer/visualizer";
import useResizeObserver from "@/functions/resizeObserver";
import { RepeatIcon, PlayIcon, PauseIcon, ShuffleIcon, PlusIcon, ListMusic, TrashIcon, ChevronUpIcon, StepForwardIcon, StepBackIcon, ListOrderedIcon, XIcon, ImageIcon, AudioWaveformIcon, PencilIcon } from "lucide-react";







export default function Home() {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const visualizerContainerRef = useRef(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [visualizerType, setVisualizerType] = useState<Visualizer>({ type: 'Toruses' });
  const [visualizerMode, setVisualizerMode] = useState<Visualizer>({ mode: 'Image' });
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('add');
  const [isSongToastVisible, setIsSongToastVisible] = useState(true);
  const { parentWidth, parentHeight } = useResizeObserver(visualizerContainerRef);
  const defaultSongName = "No Song Selected";
  const defaultSongArtist = "Unknown Artist";


  useEffect(() => {
    // Only set up the context and analyser if there's a file and the audio context has not been created
    if (audioFile && !audioContextRef.current) {
      const AudioContext = window.AudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
  
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      audioContextRef.current = audioContext;
  
      // When the audio element is loaded with the new source
      if (audioRef.current) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination); // Connect to output to hear the sound
      }
    }
  }, [audioFile]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close(); // Close the audio context to free up resources
      }
    };
  }, []);

  // Effect to load the new song
  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      audio.src = currentSong.src;
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        audio.play().catch(e => console.error("Error playing the song: ", e));
      };
    }
  }, [currentSong]); // Only update on currentSong change



  // Automatically handle play/pause when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Error while trying to play: ", e);
          setIsPlaying(false); // Automatically pause if play is not possible
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Effect to update time as song plays
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        setCurrentTime(audioRef.current.currentTime);
        setSliderValue((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    // Start playing automatically if there are songs in the queue when the component mounts
    if (queue.length > 0 && !currentSong) {
      setCurrentSong(queue[0]);
      setIsPlaying(true);
    }
  }, [queue, currentSong]);

  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const onAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const onImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSongTitle(event.target.value);
  };

  const onArtistChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSongArtist(event.target.value);
  };

  const onVisualizerTypeChange = (value: string) => {
    setVisualizerType({ type: value as Visualizer['type'] });
  };
  const onVisualizerModeChange = (value: string) => {
    setVisualizerType({ mode: value as Visualizer['mode'] });
  };

  const onSongRepeatChange = () => {
    setIsRepeating(!isRepeating);
  }
  const handleAudioUpload = () => {
    if (!audioFile || !imageFile || !songTitle) {
      toast.error("Please fill all fields before uploading.", { position: "top-right", duration: 5000});
      return;
    }
    const audioSrc = URL.createObjectURL(audioFile);
    const imageSrc = URL.createObjectURL(imageFile);
    
    const tempAudio = new Audio(audioSrc);
    tempAudio.onloadedmetadata = () => {
      const songDuration = Math.floor(tempAudio.duration);
      const newSong: Song = {
        id: Math.random().toString(36).substring(2, 9), // Generate a random ID for the song
        name: songTitle,
        artist: songArtist,
        src: audioSrc,
        img: imageSrc,
        duration: songDuration
      };

      setSongs(prev => [...prev, newSong]);
      setIsDialogOpen(false);
      setSongTitle('');
      setSongArtist('');
      toast.success("Song added successfully!", { position: "top-right", duration: 5000 });
    };
  };

  const selectSong = (song: Song) => {
    // Check if the song is already in the queue
    const existingIndex = queue.findIndex(item => item.id === song.id);
    let newQueue = [];
    if (existingIndex >= 0) {
        // Move song to the top of the queue if it's already in it
        newQueue = [queue[existingIndex], ...queue.slice(0, existingIndex), ...queue.slice(existingIndex + 1)];
    } else {
        // Add new song to the top of the queue if it's not already there
        const queueItem = createQueueItem(song);
        newQueue = [queueItem, ...queue];
    }
    setQueue(newQueue);
    setCurrentSong(song);
    setIsPlaying(true);
    setIsSongToastVisible(true);
  };

  const playNextSong = () => {
    if (isRepeating && audioRef.current) {
      // If repeating is enabled, restart the current song
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {

      const currentIndex = queue.findIndex(q => q.id === currentSong?.id);
  
      // Remove the current song from the queue
      const newQueue = [...queue.slice(0, currentIndex), ...queue.slice(currentIndex + 1)];
      setQueue(newQueue);
  
      // Check if there's a next song in the queue
      if (currentIndex !== -1 && currentIndex < newQueue.length) {
        setCurrentSong(newQueue[currentIndex]); // Play the next song
      } else {
        // No more songs in the queue, stop playing
        setCurrentSong(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setSliderValue(0);
      }
    }
  };

  const createQueueItem = (song: Song) => {
      // Function to create a queue item
      return {
          ...song,
          queueId: `${song.id}-${new Date().getTime()}`,  // Create a unique queueId
          isPlaying: false
      };
  };
  
  const handleDeleteSong = (index: number) => {
    const isCurrentSong = songs[index] === currentSong;
    setSongs(prevSongs => prevSongs.filter((_, i) => i !== index));

    if (isCurrentSong) {
        if (audioRef.current) {
            audioRef.current.pause();  // Stop the audio if it's playing
            audioRef.current.src = ""; // Release the audio object by clearing the source
        }
        setCurrentSong(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setSliderValue(0);  // Reset the slider value as well
    }

    toast.success("Song deleted successfully!", { position: "top-right", duration: 5000 });
  };

  const toggleSongToastVisibility = () => { 
    setIsSongToastVisible(!isSongToastVisible);
  }

  const togglePlayPause = () => {
    if (queue.length !== 0) {
      setIsPlaying(prevIsPlaying => !prevIsPlaying);
    }
  };

  const handleSliderChange = throttle((value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    if (audioRef.current) {
      const newTime = (newValue / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, 100);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );
  
  const addToQueue = (song: Song) => {
    // Function to directly add a song to the queue without playing it immediately
    const queueItem = createQueueItem(song);
    setQueue(prev => [...prev, queueItem]);
    setIsSongToastVisible(true);
    toast.success("Song added to queue!", { position: "top-right", duration: 5000 });
  };
  
  const removeFromQueue = (index: number) => {
    const songToRemove = queue[index];

    // Check if the song being removed is the currently playing song
    if (currentSong && songToRemove.id === currentSong.id) {
        // Remove the song from the queue
        const updatedQueue = [...queue.slice(0, index), ...queue.slice(index + 1)];
        setQueue(updatedQueue);

        // If there are no more songs in the queue, stop the player and clear the current song
        if (updatedQueue.length === 0) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";  // Clear the audio source
            }
            setCurrentSong(null);
            setIsPlaying(false);
            setCurrentTime(0);
            setSliderValue(0);
            toast.info("Queue is empty. Add more songs to continue playing.", { position: "top-right", duration: 5000 });
        } else {
            // Play the next song if available
            if (index < updatedQueue.length) {
                setCurrentSong(updatedQueue[index]); // Play the next song
            } else {
                setCurrentSong(updatedQueue[0]); // Or loop back to the first song
            }
        }
    } else {
        // If the song being removed isn't currently playing, simply update the queue
        setQueue(prev => prev.filter((_, i) => i !== index));
    }

    toast.success("Song removed from queue!", { position: "top-right", duration: 5000 });
  };

  const shuffleQueue = () => {
    if (queue.length === 0) {
      toast.info("Queue is empty. Add more songs to shuffle.", { position: "top-right", duration: 5000 });
      return;
    } 

    let shuffled = [...queue];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQueue(shuffled);

    if (shuffled.length > 0 && (!currentSong || shuffled[0].id !== currentSong.id)) {
      setCurrentSong(shuffled[0]);
      setIsPlaying(true);
    }
  };

  const handleDragEnd = (event: { active: any; over: any; }) => {
    const { active, over } = event;
  
    if (over && active.id !== over.id) {
      setQueue((currentQueue) => {
        const oldIndex = currentQueue.findIndex(item => item.queueId === active.id);
        const newIndex = currentQueue.findIndex(item => item.queueId === over.id);
        return arrayMove(currentQueue, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <NavBar/>
      <audio
        ref={audioRef}
        onEnded={playNextSong}
        src={currentSong?.src}
        autoPlay={isPlaying}
      />
      <Sheet>
        <main className="flex w-screen min-h-screen flex-col items-center font-jersey justify-center p-12">
          <div className="h-screen w-full flex flex-col items-center">
            <header className="w-full h-14 flex items-center justify-between border-b px-4">
              <h2 className="font-semibold text-lg">Now Playing</h2>
              <h1 className="text-2xl font-jersey lg:text-5xl">AudioGlow</h1>
              <SheetTrigger asChild>
                <Button variant="outline"><ListMusic className="size-8"/></Button>
              </SheetTrigger>
            </header>
            {/* Visualizer */}
            <div ref={visualizerContainerRef} className="w-full h-2/3 flex justify-center overflow-hidden items-center bg-visualizer border rounded-xl my-4 cursor-grab">
              {parentWidth && parentHeight ? (
                <AudioVisualizer analyserRef={analyserRef} width={parentWidth} height={parentHeight} image={currentSong?.img || 'default.webp'} type={visualizerType} />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="loader"/>
                  <p className="text-gray-200">Loading...</p>
                </div>
                
              )}
            </div>
            <div className="w-full flex flex-row justify-start items-center space-x-2">
              {/* Visualizer Type Options */}
              <div className="flex flex-col justify-center items-center space-y-2">
                <Select name="visualizerTypeSelect" onValueChange={onVisualizerTypeChange} defaultValue={"Toruses"}>
                  <SelectTrigger className="min-w-max">
                    <SelectValue placeholder="Select a visualizer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup >
                      <SelectLabel className="font-jersey text-lg">Visualizer Types</SelectLabel>
                      <SelectItem value="Toruses" className="font-jersey text-md">Toruses</SelectItem>
                      <SelectItem value="Line Waves" className="font-jersey text-md">Line Waves</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Visualizer Type</p>
              </div>
              {/* Visualizer Mode Options */}
              {/* {visualizerType.type === "Line Waves" && (
                <div className="flex flex-col justify-center items-center space-y-2">
                  <Select name="visualizerModeSelect" onValueChange={onVisualizerModeChange} defaultValue={"Image"}>
                    <SelectTrigger className="min-w-max">
                      <SelectValue placeholder="Select a visualizer mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="font-jersey text-lg">Visualizer Mode</SelectLabel>
                        <SelectItem value="Image" className="font-jersey text-md">Image</SelectItem>
                        <SelectItem value="Colors" className="font-jersey text-md">Colors</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Visualizer Mode</p>
                </div>
              )} */}
              
            </div>
            
            
            {/* Song Information */}
            <div className="fixed bottom-0 right-0">
              <div className={`w-96 relative flex flex-col items-center justify-center text-center gap-4 m-4 p-4 transition-transform ${isSongToastVisible ? 'translate-y-0' : 'translate-y-full'} rounded-lg shadow-2xl shadow-slate-500 border bg-white`}>
                {/* Display Button */}
                <button
                    onClick={toggleSongToastVisibility}
                    className={`absolute -top-12 right-2 p-2 rounded-tl-full rounded-tr-full border bg-white hover:text-red-500 hover:ring-1 hover:ring-red-500 transition duration-300`} 
                >
                    <ChevronUpIcon className={`h-8 w-8 ${isSongToastVisible ? 'rotate-180 transform' : ''}`} />
                </button>
                {/* Toast content */}

                {/* Image */}
                <Image src={currentSong?.img || "/default.webp"} alt={currentSong?.name || ""} width={25} height={25} className="size-24 rounded-full shadow" />
                {/* Info */}
                <div>
                  <h3 className="text-lg font-bold">{currentSong ? currentSong.name : defaultSongName}</h3>
                  <p className="text-sm text-gray-600">{currentSong ? currentSong.artist : defaultSongArtist}</p>
                </div>
                {/* Song Slider */}
                <Slider className="mx-4" id="songSlider" name="songSlider" value={[sliderValue]} onValueChange={handleSliderChange} disabled={!currentSong}/>
                {/* Time */}
                <div>{formatTime(currentTime)}/{currentSong ? formatTime(duration) : "0:00"}</div>
                {/* Controls */}
                <div className="space-y-2">
                  
                  <div className="space-x-2">
                    <Button onClick={() => {}} size="icon" variant="outline">
                      <StepBackIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={togglePlayPause} size="icon" variant="outline">
                      {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                    </Button>
                    <Button onClick={playNextSong} size="icon" variant="outline">
                      <StepForwardIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
        </main>
        <SheetContent side="left">
          <Tabs defaultValue="add" value={selectedTab} onValueChange={setSelectedTab} className="w-full flex flex-col justify-center items-center">
            <TabsList className="w-11/12">
                <TabsTrigger value="add">Add</TabsTrigger>
                <TabsTrigger value="playlist">Playlist ({songs.length})</TabsTrigger>
                <TabsTrigger value="queue">Queue ({queue.length})</TabsTrigger>
            </TabsList>
            <div className="flex flex-col items-center justify-center gap-4 p-4">
                <TabsContent value="add">
                  <SheetHeader>
                    <SheetTitle>Add Music</SheetTitle>
                    <SheetDescription>
                      Click the box below to add an audio file to the list.
                    </SheetDescription>
                  </SheetHeader>
                  <Dialog 
                    open={isDialogOpen}
                    onOpenChange={
                      () => {
                        setIsDialogOpen(!isDialogOpen);
                        setSongTitle('');
                        setSongArtist('');
                        setAudioFile(null);
                        setAudioFileName('');
                        setImageFile(null);
                        setImageFileName('');
                      }
                    }
                  >
                    <DialogTrigger asChild>
                      <div className="border-dashed border-2 border-gray-200 rounded-lg w-full h-[100px] my-4 flex items-center justify-center text-gray-500 hover:cursor-pointer">
                        <PlusIcon className="h-8 w-8 text-gray-500" />
                        <span className="sr-only">Add audio</span>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="w-full">
                      <DialogHeader>
                        <DialogTitle>Upload your file</DialogTitle>
                        <DialogDescription>
                          Select the audio file you wish to add.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="w-full space-x-4">
                        <label htmlFor="songTitle" className="w-1/2">Title:</label>
                        <input className="px-2 border-2 rounded" type="text" id="songTitle" name="songTitle" value={songTitle} onChange={onTitleChange} placeholder="Enter song title" />
                      </div>
                      <div className="space-x-4">
                        <label htmlFor="songArtist">Artist:</label>
                        <input className="px-2 border-2 rounded" type="text" id="songArtist" name="songArtist" value={songArtist} onChange={onArtistChange} placeholder="Enter song artist" />
                      </div>
                      <div className="flex justify-start items-center space-x-4">
                        <label htmlFor="audioFile">Audio File:</label>
                        <input type="file" accept="audio/*" id="audioFile" name="audioFile" ref={audioInputRef} onChange={onAudioFileChange} className="hidden"/>
                        <Button onClick={() => audioInputRef.current && audioInputRef.current.click()} variant="outline">
                          {audioFile ? <AudioWaveformIcon className="h-4 w-4"/>:<PlusIcon className="h-4 w-4"/>} &nbsp; {audioFile ? "Change Audio" : "Upload Audio"}
                        </Button>
                        {audioFile && (
                          <div className="flex items-center overflow-hidden max-w-48">
                            <span className="truncate text-sm">{audioFileName}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-start items-center space-x-4 ">
                        <label htmlFor="imageFile">Song Image:</label>
                        <input type="file" accept="image/*" id="imageFile" name="imageFile" ref={imageInputRef} onChange={onImageFileChange} className="hidden" />
                        <Button onClick={() => imageInputRef.current && imageInputRef.current.click()} variant="outline">
                          {imageFile ? <ImageIcon className="h-4 w-4"/>:<PlusIcon className="h-4 w-4"/>} &nbsp;{imageFile ? "Change Image" : "Upload Image"}
                        </Button>
                        {imageFile && (
                          <div className="flex items-center overflow-hidden max-w-48">
                            <span className="truncate text-sm">{imageFileName}</span>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAudioUpload}>Upload Song</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
                <TabsContent value="playlist">
                  <SheetHeader>
                    <SheetTitle>Select Music</SheetTitle>
                    <SheetDescription>
                      Click on any songs you&apos;ve added to play them.
                    </SheetDescription>
                  </SheetHeader>
                  {songs.length > 0 ? (
                    songs.map((song: Song, index: number) => (
                      <div key={index} className="w-full h-auto relative flex justify-between items-center gap-4 p-2 my-6 border rounded text-ellipsis hover:bg-gray-100 hover:scale-110 transition-transform cursor-pointer" onClick={() => selectSong(song)}>
                        <div>
                          <p className="text-md ">{song.name}</p>
                          <p className="text-sm text-stone-500">{song.artist}</p>
                          <p className="text-sm text-stone-500">{formatTime(song.duration)}</p>
                        </div>
                        
                        <Image src={song.img} alt="album cover" width={25} height={25} className="size-24 aspect-[1/1] bg-cover rounded-lg shadow-xl"/>
                        <Button
                          className="absolute -bottom-4 left-0 p-1 cursor-pointer bg-white text-black border-black border-2 rounded-full hover:text-red-700 hover:border-red-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToQueue(song);
                          }}
                        >
                          <ListOrderedIcon className="size-6"/>
                        </Button>
                        <Button
                          className="absolute -bottom-4 left-8 p-1 cursor-pointer bg-white text-black border-black border-2 rounded-full hover:text-red-700 hover:border-red-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSong(index);
                          }}
                        >
                          <TrashIcon className="size-6"/>
                        </Button>
                        <Button
                          className="absolute -bottom-4 left-16 p-1 cursor-pointer bg-white text-black border-black border-2 rounded-full hover:text-red-700 hover:border-red-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <PencilIcon className="size-6"/>
                        </Button>
                        
                        
                      </div>
                    ))) :
                    (
                      <div className="flex flex-row justify-center text-sm text-center my-4">
                        <p>No songs available. &nbsp;</p>
                        <span className="underline cursor-pointer" onClick={() => setSelectedTab('add')}>Add?</span>
                      </div>
                    )
                }
                  
                </TabsContent>
                <TabsContent value="queue">
                  <SheetHeader>
                    <SheetTitle>Music Queue</SheetTitle>
                    <SheetDescription>
                      Add music to queue then drag & drop accordingly.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-row items-center justify-center space-x-8">
                    <div className="flex flex-col items-center justify-center my-8 space-y-2">
                      <Button onClick={shuffleQueue} variant="outline">
                        <ShuffleIcon className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-gray-500">Shuffle Queue</p>
                    </div>
                    <div className="flex flex-col items-center justify-center my-8 space-y-2">
                      <Toggle aria-checked={isRepeating} aria-pressed={isRepeating} aria-selected={isRepeating} onPressedChange={onSongRepeatChange} variant="outline">
                          <RepeatIcon className={`h-4 w-4`} />
                      </Toggle>
                      <p className="text-xs text-gray-500">Repeat Song</p>
                    </div>
                    
                  </div>
                  
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={queue.map(item => item.queueId)} strategy={verticalListSortingStrategy}>
                      {queue.length > 0 ? (
                        queue.map((item, index) => (
                          <SortableItem key={item.queueId} id={item.queueId}>
                            <div className="flex justify-between items-center gap-4 p-2 my-2 border rounded hover:bg-gray-100 transition-transform duration-300">
                              <Image src={item.img} alt="album cover" width={25} height={25} className="size-12 rounded-lg shadow"/>
                              <div>
                                <p className="text-md font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.artist}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromQueue(index);
                                }}
                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-700 transition-colors"
                              >
                                <XIcon className="w-6 h-6"/>
                              </button>
                            </div>
                          </SortableItem>
                        ))
                      ) : (
                        <p className="text-center text-sm my-4">No songs in queue.</p>
                      )}
                    </SortableContext>
                  </DndContext>
                </TabsContent>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <div className="flex flex-row justify-end">
                  <Button type="submit" id="sheetClose" name="sheetClose">Close</Button>
                </div>
                
              </SheetClose>
            </SheetFooter>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
    
  );
}


