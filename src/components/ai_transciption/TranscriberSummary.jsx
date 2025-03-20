import { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { TranscriptionContext } from "../../pages/dashboard";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { useEffect } from "react";
import { saveAs } from "file-saver";
const TranscriberSummary = () => {
    const { transc: transcription } = useContext(TranscriptionContext);
    const [desc, setDesc] = useState("");
    const [speakers, setSpeakers] = useState("");
    const [cleanedTranscription, setCleanedTranscription] = useState("");
    const [summary, setSummary] = useState("");
    const [correctedText, setCorrectedText] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (correctedText) {
            handleSummary();
        }
    }, [correctedText]); // Runs handleSummary() only when correctedText changes

    // const model = new ChatOpenAI({
    //     openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    //     temperature: 0,
    // });


    const handleCorrectTranscription = async (e) => {
        e.preventDefault(); // Prevents form refresh
        setLoading(true);
        setError("");
    
        try {
          const response = await axios.post("http://localhost:5000/correctTranscribe", {
            desc: desc,
            speakers: speakers
          }, {
            headers: { "Content-Type": "application/json" }
        });
        //   console.log(response.data)
          setCorrectedText(response.data.fullCorrectedTranscription);
          console.log(correctedText)
          
        //   while(correctedText === "")
        //   {
        //     handleSummary();
        //   }
          
        //   handleSummary()
        } catch (err) {
          setError("Failed to fetch corrected transcription.");
          console.error("API Error:", err);
          
        } finally {
        
          setLoading(false);
        }
      };


      const handleSummary =  async () => {
        // e.preventDefault(); // Prevents form refresh
        // setLoading(true);
        // setError("");
        console.log(correctedText)
    
        try {
          const response = await axios.post("http://localhost:5000/summarize", {
            transcription: correctedText
          }, {
            headers: { "Content-Type": "application/json" }
        });
        //   console.log(response.data)
        setSummary(response.data.summary)
        } catch (err) {
          setError("Failed to fetch corrected transcription.");
          console.error("API Error:", err);
        } finally {
          setLoading(false);
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
          docContent = correctedText;
          fileName = "Cleaned_Transcription.docx";
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
                                  text: type === "transcription" ? "Cleaned Transcription" : "Summary",
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

  const handleReset = () => {
    window.location.reload(); // Reload the page
};

    return (
        <div>
            <h3>Transcription Optimization</h3>
            <label>Description:</label>
            <div style={{ marginTop: "1rem" }}>
                <form onSubmit={handleCorrectTranscription}>
                    <InputText
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Give a short description about the audio log"
                    />
                    <InputText
                        value={speakers}
                        onChange={(e) => setSpeakers(e.target.value)}
                        placeholder="Specify the number of speakers"
                        style={{ marginLeft: "1rem" }}
                    />
                    <Button
                        label="Summarize"
                        type="submit"
                        className="p-button-secondary"
                        style={{ marginLeft: "1rem" }}
                    />
                </form>
            </div>

            {/* ✅ Display AI processing results */}
            {loading ? (
                <div style={{ marginTop: "2rem", display: "flex" }}>
                    <ProgressSpinner className="text-align-center" />
                </div>
            ) : (
                <>
                    <h4>Cleaned Transcription</h4>
                    <InputTextarea
                        variant="outlined"
                        readOnly
                        value={correctedText}
                        rows={15}
                        cols={120}
                        style={{
                            width: "100%",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            overflowY: "auto",
                        }}
                    />

                    {correctedText && (
                        <Button
                            label="Export Transcription"
                            className="p-button-success"
                            onClick={() => exportToDocx("transcription")}
                            style={{ marginTop: "1rem" }}
                        />
                      )}

                    <h4>Summary</h4>
                    <InputTextarea
                        variant="outlined"
                        readOnly
                        value={summary}
                        rows={15}
                        cols={120}
                        style={{
                            width: "100%",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            overflowY: "auto",
                        }}
                    />
                    {summary && (
                        <Button
                            label="Export Summary"
                            className="p-button-primary"
                            onClick={() => exportToDocx("summary")}
                            style={{ marginTop: "1rem" }}
                        />
                    )}

                    {/* RESET BUTTON: Display only if transcription or summary exists */}
                    {(correctedText && summary) && (
                        <div style={{ marginTop: "2rem" }}>
                            <Button
                                label="Reset"
                                className="p-button-danger"
                                onClick={handleReset}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TranscriberSummary;
