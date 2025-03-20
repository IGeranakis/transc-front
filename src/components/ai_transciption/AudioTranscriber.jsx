import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { TranscriptionContext } from "../../pages/dashboard";
import { useContext } from "react";
import { useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const AudioTranscriber = () => {
    const [useRecording, setUseRecording] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [audioSrc, setAudioSrc] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [audioFileName, setAudioFileName] = useState("");
    const [transcription, setTranscription] = useState("");
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const recordingIntervalRef = useRef(null);

    const { setTransc } = useContext(TranscriptionContext);
    // setTransc([...transc, "...Loading"]);

    useEffect(() => {
        if (transcription) {
          // Only update the context with transcription if it's non-empty
          setTransc(transcription); 
        }
      }, [transcription, setTransc]);
    

    const handleFileUpload = (event) => {
        const file = event.files[0];
        if (file) {
            setAudioFile(file);
            setAudioFileName(file.name);
            setAudioSrc(URL.createObjectURL(file));
            setTranscription("");
        }
    };

    const toggleRecording = async () => {
        if (!isRecording) {
            await startRecording();
        } else {
            stopRecording();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            let audioChunks = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                setAudioSrc(URL.createObjectURL(audioBlob));
                setAudioFile(audioBlob);
                setAudioFileName("recorded_audio.wav");
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingDuration(0);

            recordingIntervalRef.current = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        clearInterval(recordingIntervalRef.current);
    };

    const transcribeAudio = async () => {
        if (!audioFile) return;
        
        setIsTranscribing(true);
        setTranscription("");

        const formData = new FormData();
        formData.append("file", audioFile);
        
        try {
            const response = await fetch("http://localhost:5000/transcribe", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setTranscription(data.text);

        } catch (error) {
            console.error("Error transcribing:", error);
            //setTranscription("Error transcribing audio.");
        } finally {
            setIsTranscribing(false);

        }
    };

    const formatTextForDocx = (text) => {
        if (!text) return "No content available.";

        // Ensure a newline before each "-"
        const formattedText = text.replace(/-/g, "\n-");

        // Split into paragraphs for better formatting
        return formattedText.split("\n").map(line => new Paragraph({ text: line }));
    };

    const exportToDocx = (type) => {
      let docContent, fileName;

      if (type === "transcription") {
          docContent = transcription;
          fileName = "Initial_Transcription.docx";
      } else if (type === "summary") {
          docContent = summary;
          fileName = "Summary.docx";
      }

      const doc = new Document({
          sections: [
              {
                  properties: {},
                  children: [
                      new Paragraph({
                          children: [
                              new TextRun({
                                  text: type === "transcription" ? "Initial Transcription" : "Summary",
                                  bold: true,
                                  size: 24,
                              }),
                          ],
                      }),
                      ...formatTextForDocx(docContent),
                  ],
              },
          ],
      });

      Packer.toBlob(doc).then((blob) => {
          saveAs(blob, fileName);
      });
  };

    return (
        <div className="p-4">
            <Card>
                {!transcription && (
                <div>
                <h5>Choose Audio Input</h5>
                <div className="mb-3">
                    <Button label="Upload File" className={!useRecording ? "p-button-primary" : "p-button-outlined"} onClick={() => setUseRecording(false)} />
                    <Button label="Record Audio" className={useRecording ? "p-button-primary" : "p-button-outlined"} onClick={() => setUseRecording(true)} />
                </div>

                {!useRecording ? (
                    <div>
                        <FileUpload mode="basic" accept="audio/*" auto chooseLabel="Select Audio" customUpload onSelect={handleFileUpload} />
                        {audioFileName && <p className="mt-2">Selected: {audioFileName}</p>}
                    </div>
                ) : (
                    <div>
                        <Button label={isRecording ? "Stop Recording" : "Start Recording"} className={isRecording ? "p-button-danger" : "p-button-success"} onClick={toggleRecording} />
                        {recordingDuration > 0 && <p className="mt-2">Duration: {recordingDuration}s</p>}
                    </div>
                )}

                <div>

                {audioSrc && <audio src={audioSrc} controls className="mt-3" />}

                {audioFile && (
                    <Button label={isTranscribing ? "Transcribing..." : "Transcribe Audio"} className="p-button-warning mt-3" onClick={transcribeAudio} disabled={isTranscribing} />
                )}

                    
                </div>
                </div>
                )}
                

                {isTranscribing && <ProgressSpinner className="mt-3" />}

                {transcription && (
                    <div>
                    <div className="mt-3">
                        <h5>Transcribed Text:</h5>
                        <p className="p-2 border-1 surface-border">{transcription}</p>
                    </div>
                    <Button
                    label="Export Initial Transcription"
                    className="p-button-success"
                    onClick={() => exportToDocx("transcription")}
                    style={{ marginTop: "1rem" }}
                />
                </div>
                )}
            </Card>
        </div>
    );
};

export default AudioTranscriber;