import React, { useState, useRef, useEffect } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Mic, MicOff, BrainCircuit, TerminalSquare, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Voice() {
  const { transcript, intent, sendCommand } = useAgentStore();
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const drawFlatLine = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a78bfa';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      let maxDeviation = 0;
      for (let i = 0; i < bufferLength; i++) {
        const deviation = Math.abs(dataArray[i] - 128);
        if (deviation > maxDeviation) maxDeviation = deviation;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;

      // Sensitive threshold for normal speaking volumes
      const NOISE_THRESHOLD = 12; 

      if (maxDeviation < NOISE_THRESHOLD) {
        ctx.strokeStyle = '#a78bfa'; 
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#8b5cf6'; 
        ctx.beginPath();
        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    };
    draw();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048; 
      drawWaveform(); 

      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          sendCommand('voice_command', { audio_data: base64data });
        };
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      
      drawFlatLine();
    }
  };

  // Safe Toggle
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    drawFlatLine();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 rounded-2xl glass flex items-center justify-center">
          <AudioLines className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Voice Console</h1>
          <p className="text-muted-foreground mt-1">Speak natural language commands. JADU will interpret and execute.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="glass p-10 rounded-3xl flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="relative">
              {isRecording && (
                <>
                  <div className="absolute -inset-8 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="absolute -inset-4 bg-primary/30 rounded-full animate-ping duration-1000" />
                </>
              )}
              
              <Button
                size="icon"
                className={cn(
                  "relative h-32 w-32 rounded-full shadow-2xl transition-all duration-500 border-4 border-white/20 dark:border-white/5 backdrop-blur-md",
                  isRecording 
                    ? "bg-primary text-white scale-105" 
                    : "bg-white/50 dark:bg-black/50 text-foreground hover:scale-105 hover:bg-white/80 dark:hover:bg-white/10"
                )}
                onClick={toggleRecording} 
              >
                {isRecording ? <MicOff className="h-12 w-12 animate-pulse" /> : <Mic className="h-12 w-12" />}
              </Button>
            </div>

            <div className="w-full max-w-[250px] h-16">
              <canvas 
                ref={canvasRef} 
                width="250" 
                height="64" 
                className="w-full h-full opacity-80"
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold tracking-tight">{isRecording ? "Listening to your command..." : "Click to Speak"}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {isRecording ? "Click the button again when finished." : <span>Try saying: <span className="text-foreground font-medium">"Open Chrome and go to Instagram"</span></span>}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="glass p-6 rounded-2xl flex-1 flex flex-col space-y-4 transition-all hover:shadow-md">
            <div className="flex items-center space-x-3 pb-4 border-b border-white/20 dark:border-white/10">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <TerminalSquare className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold tracking-wide">Whisper Transcript</h3>
            </div>
            <p className="font-mono text-sm leading-relaxed text-foreground/80 break-words flex-1">
              {transcript ? `> ${transcript}` : <span className="text-muted-foreground italic">Awaiting audio input stream...</span>}
            </p>
          </div>

          <div className="glass p-6 rounded-2xl flex-1 flex flex-col space-y-4 bg-black/5 dark:bg-black/20 border border-primary/20 transition-all hover:shadow-md">
            <div className="flex items-center space-x-3 pb-4 border-b border-primary/10">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold tracking-wide text-primary">Gemini Execution Payload</h3>
            </div>
            <pre className="font-mono text-xs leading-relaxed text-primary/80 overflow-x-auto custom-scrollbar flex-1">
              {intent ? JSON.stringify(intent, null, 2) : "{\n  // Awaiting AI intent inference pipeline...\n}"}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}