import { useRouter } from "next/router";
import { useAnchor } from "@anchor-protocol/react";
import { Whisper } from "whisper-deno";
import { Completion } from "@openai/client";
import { ElevenLabs } from "elevenlabs-node";

const IndexPage: React.FC = () => {
  const router = useRouter();
  const anchor = useAnchor();

  const [transcription, setTranscription] = React.useState("");
  const [translation, setTranslation] = React.useState("");
  const [dubbing, setDubbing] = React.useState("");

  const handleSubmit = async () => {
    const videoUrl = router.query.link as string;

    // Transcribe the video
    const whisper = new Whisper();
    const transcriptionResult = await whisper.transcribe(videoUrl);
    setTranscription(transcriptionResult.text);

    // Translate the transcription
    const completion = new Completion();
    const translationResult = await completion.create({
      engine: "text-davinci-003",
      prompt: `Translate the following text into ${language}: ${transcription}`,
    });
    setTranslation(translationResult.choices[0].text);

    // Dub the translation
    const elevenLabs = new ElevenLabs();
    const dubbingResult = await elevenLabs.generate({
      text: translation,
      voice: "Antoni",
      model: "eleven_multilingual_v1",
    });
    setDubbing(dubbingResult);

    // Combine the dubbed audio with the video
    const video = anchor.createProgram({
      name: "combine-video-audio",
      args: [videoUrl, dubbing],
    });

    await video.execute();

    // Download the dubbed video
    const videoLink = await video.getResults();
    window.open(videoLink, "_blank");
  };

  return (
    <div>
      <h1>Mother Tongue AI 📺🎵</h1>
      <input type="text" placeholder="Link to Youtube Video" />
      <select>
        <option value="hindi">Hindi</option>
        <option value="marathi">Marathi</option>
        <option value="tamil">Tamil</option>
        <option value="telugu">Telugu</option>
        <option value="spanish">Spanish</option>
      </select>
      <button onClick={handleSubmit}>Transcribe!</button>
    </div>
  );
};

export default IndexPage;
