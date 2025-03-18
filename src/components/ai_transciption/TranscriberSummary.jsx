import { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { TranscriptionContext } from "../../pages/dashboard";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { InputTextarea } from "primereact/inputtextarea";

const TranscriberSummary = () => {
    const { transc } = useContext(TranscriptionContext);
    const [desc, setDesc] = useState("");
    const [speakers, setSpeakers] = useState("");
    const [cleanedTranscription, setCleanedTranscription] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const model = new ChatOpenAI({
        openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
        temperature: 0.7,
    });

    // ✅ Function to split text into chunks
    const splitTextIntoChunks = (text, chunkSize = 1000) => {
        const words = text.split(" ");
        let chunks = [];
        let currentChunk = [];

        for (let word of words) {
            currentChunk.push(word);
            if (currentChunk.join(" ").length >= chunkSize) {
                chunks.push(currentChunk.join(" "));
                currentChunk = [];
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(" "));
        }

        return chunks;
    };

    // ✅ Step 1: Clean Transcription
    const cleanTranscription = async () => {
        if (!transc || !desc || !speakers) return;
        setLoading(true);

        try {
            const chunks = splitTextIntoChunks(transc, 1000); // ✅ Fix variable name
            let cleanedChunks = [];

            for (let chunk of chunks) {
                const cleanPrompt = PromptTemplate.fromTemplate(`
                The text is about {desc}. The number of speakers are {speakers}.

                You are a helpful AI that will optimize a transcribed conversation while keeping it natural and easy to read.
                1. Fix punctuation, spelling, and capitalization.  
                2. Use a '-' before each speaker change (instead of "Speaker 1:").  
                3. Remove filler words ("um", "uh", "you know"), unless necessary for tone.  
                4. Break long sentences into shorter, readable ones.  
                5. Keep contractions (e.g., "I'm" instead of "I am").  
                6. If someone speaks for too long, split it into smaller paragraphs.  
                7. Preserve informal speech while improving clarity.  
                8. Format the response in a clean, readable way.

                Here is a part of the transcription:
                {chunk}`);

                const formattedPrompt = await cleanPrompt.format({
                    desc,
                    speakers,
                    chunk, // ✅ Fix: Use chunk instead of full transcription
                });

                const response = await model.invoke(formattedPrompt);
                cleanedChunks.push(response.content.trim()); // ✅ Remove unnecessary spaces
            }

            // ✅ Merge cleaned chunks
            const finalCleanedTranscription = cleanedChunks.join("\n\n");
            setCleanedTranscription(finalCleanedTranscription);

            // ✅ Generate summary after cleaning
            generateSummary(finalCleanedTranscription);
        } catch (error) {
            console.error("Error cleaning transcription:", error);
            setCleanedTranscription("Failed to clean transcription.");
        }
        setLoading(false);
    };

    // ✅ Step 2: Generate Summary
    const generateSummary = async (text) => {
        if (!text) return;
        setLoading(true);

        try {
            const summaryPrompt = PromptTemplate.fromTemplate(`
            You are a helpful assistant that will summarize the given transcription while preserving its original language.

            1. First, detect the language of the transcription.
            2. Summarize the transcription **without changing the language**.
            3. Just provide the summary. Do not ask questions or add extra commentary.

            Here is the cleaned transcription:
            {cleanedTranscription}`);

            const formattedPrompt = await summaryPrompt.format({
                cleanedTranscription: text,
            });

            const response = await model.invoke(formattedPrompt);
            setSummary(response.content.trim()); // ✅ Trim extra spaces
        } catch (error) {
            console.error("Error generating summary:", error);
            setSummary("Failed to generate summary.");
        }
        setLoading(false);
    };

    // ✅ Handle form submission
    const summarize = (e) => {
        e.preventDefault(); // Prevent page reload
        cleanTranscription(); // Call AI processing once
    };

    return (
        <div>
            <h3>Transcription Summary</h3>
            <label>Description:</label>
            <div style={{ marginTop: "1rem" }}>
                <form onSubmit={summarize}>
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
                        value={cleanedTranscription}
                        rows={15}
                        cols={120}
                        style={{
                            width: "100%",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            overflowY: "auto",
                        }}
                    />

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
                </>
            )}
        </div>
    );
};

export default TranscriberSummary;
