import React, { useEffect, useRef, useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Camera, CameraOff, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Gestures() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // FIXED: Destructuring sendCommand from the Agent Store!
  const { detectedGesture, sendCommand } = useAgentStore();
  
  const [isActive, setIsActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let intervalId: any;

    if (isActive) {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64Frame = canvas.toDataURL('image/jpeg', 0.4);
            sendCommand('video_frame', { frame: base64Frame });
          }
        }
      }, 120);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, sendCommand]);

  const toggleCamera = async () => {
    if (isActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 360, frameRate: 15 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        streamRef.current = stream;
        setIsActive(true);
      } catch (err) {
        console.error("Camera connection failed:", err);
        alert("Please authorize hardware camera access endpoints.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gesture Center</h1>
        <p className="text-muted-foreground mt-1">
          Control computer systems using hardware hand gesture spatial orchestration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="glass rounded-xl border border-border/50 overflow-hidden bg-black aspect-video relative flex items-center justify-center">
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              style={{ display: isActive ? 'block' : 'none' }}
              playsInline
              muted
            />
            <canvas ref={canvasRef} width="320" height="240" className="hidden" />

            {!isActive && (
              <div className="text-center p-6 text-muted-foreground z-10">
                <CameraOff className="h-12 w-12 mx-auto stroke-1 mb-3 text-muted-foreground/60" />
                <p className="text-sm">Webcam spatial subsystem is offline.</p>
              </div>
            )}
          </div>

          <Button 
            onClick={toggleCamera} 
            className="w-full py-6 text-base font-medium shadow-md"
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? (
              <>
                <CameraOff className="mr-2 h-5 w-5" /> Terminate Camera Stream
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5" /> Initialize Optical Stream
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-semibold text-sm flex items-center tracking-wide uppercase text-muted-foreground">
              <Sparkles className="h-4 w-4 mr-2 text-primary" /> Tracking Core
            </h3>
            <div className="pt-2">
              <p className="text-xs font-medium text-muted-foreground">Inferred Action State</p>
              <p className="text-3xl font-black font-sans tracking-tight mt-1 text-foreground">
                {detectedGesture || "None"}
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-border/50 space-y-3">
            <h3 className="font-semibold text-sm flex items-center tracking-wide uppercase text-muted-foreground">
              <ShieldCheck className="h-4 w-4 mr-2 text-green-500" /> Model Pipeline
            </h3>
            <div className="text-xs font-mono space-y-2 pt-1 text-muted-foreground">
              <p className="flex justify-between">
                <span>Framework:</span> <span className="text-foreground">MediaPipe Hands</span>
              </p>
              <p className="flex justify-between">
                <span>Inference Location:</span> <span className="text-foreground">Local CPU Host</span>
              </p>
              <p className="flex justify-between">
                <span>Coordinate Targets:</span> <span className="text-foreground">21 Cartesian Joints</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
