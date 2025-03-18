import { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { TranscriptionContext } from "../../pages/dashboard";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

import { parseTemplate } from "@langchain/core/prompts";

import { InputTextarea } from 'primereact/inputtextarea';

        

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

    // Step 1: Clean Transcription
    const cleanTranscription = async () => {
        if (!transc || !desc || !speakers) return;
        setLoading(true);

        try {
            const cleanPrompt = new PromptTemplate({
                template: `
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

                Here is the transcription:
                {transcription}`,
                inputVariables: ["desc", "speakers", "transcription"],
            });

            // const cleanPrompt = new PromptTemplate({
            //     template: `You are a helpful AI that will optimize a transcribed conversation while keeping it natural and easy to read.
            //     1. Fix punctuation, spelling, and capitalization.  
            //     2. Use a `-` before each speaker change (instead of "Speaker 1:").  
            //     3. Remove filler words ("um", "uh", "you know"), unless necessary for tone.  
            //     4. Break long sentences into shorter, readable ones.  
            //     5. Keep contractions (e.g., "I'm" instead of "I am").  
            //     6. If someone speaks for too long, split it into smaller paragraphs.  
            //     7. Preserve informal speech while improving clarity.  
            //     8. Format the response in a clean, readable way.

            //     Here is the transcription:
            //     {transcription}
            //     {speakers}
            //     {desc}
            //     `,
            //     inputVariables: [ "transcription","speakers", "desc"],
            // });


            const formattedPrompt = await cleanPrompt.format({
                desc,
                speakers,
                transcription: transc,
            });

            const response = await model.invoke(formattedPrompt);
            setCleanedTranscription(response.content);

            // Step 2: Generate Summary after cleaning
            generateSummary(response.content);
        } catch (error) {
            console.error("Error cleaning transcription:", error);
            setCleanedTranscription("Failed to clean transcription.");
        }
        setLoading(false);
    };

    // Step 2: Generate Summary
    const generateSummary = async (text) => {
        if (!text) return;
        setLoading(true);

        try {
            // const summaryPrompt = new PromptTemplate({
            //     template: `You are a helpful assistant that will help summarize the transcription and use only the context provided.
            //     Just provide the Summary and do not make further questions.
            //     Give the summary always in the same language as the transcription.

            //     Here is the cleaned transcription:
            //     {cleanedTranscription}`,
            //     inputVariables: ["cleanedTranscription"],
            // });
            const summaryPrompt = new PromptTemplate({
                template: `You are a helpful assistant that will summarize the given transcription while preserving its original language.

                1. First, detect the language of the transcription.
                2. Summarize the transcription **without changing the language**.
                3. Just provide the summary. Do not ask questions or add extra commentary.

                Here is the cleaned transcription:
                {cleanedTranscription}`,
                inputVariables: ["cleanedTranscription"],
            });

            const formattedPrompt = await summaryPrompt.format({
                cleanedTranscription: text,
            });

            const response = await model.invoke(formattedPrompt);
            setSummary(response.content);
        } catch (error) {
            console.error("Error generating summary:", error);
            setSummary("Failed to generate summary.");
        }
        setLoading(false);
    };

    // Handle form submission correctly
    const summarize = (e) => {
        e.preventDefault(); // Prevent page reload
        cleanTranscription(); // Call AI processing once
    };

    return (
        <div>
            <h3>Transcription Summary</h3>
            <label>Description:</label>
            <div style={{ marginTop: "1rem"}}>
                
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

            {/* Display AI processing results */}
            
            
            {loading ? (
                <div style={{ marginTop: "2rem", display:"flex"}}>
                    <ProgressSpinner className="text-align-center"/>
                </div>
            ) : (
                <>
                    <h4>Cleaned Transcription</h4>
                    
                    <InputTextarea  variant="outlined" readOnly value={cleanedTranscription}  rows={15} cols={120} style={{width:"100%",wordWrap:"break-word",overflowWrap:"break-word",overflowY:"auto"}}/>

                    <h4>Summary</h4>
                    {/* <p>{summary || "Summary not available yet."}</p> */}
                    <InputTextarea variant="outlined" readOnly value={summary}  rows={15} cols={120} style={{width:"100%",wordWrap:"break-word",overflowWrap:"break-word",overflowY:"auto"}}/>

                </>
            )}
        </div>
    );
};

export default TranscriberSummary;
