import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Handler } from "@netlify/functions";
import { promises as fs } from "fs";

const ffmpeg = createFFmpeg({ log: true });

const handler: Handler = async (_event, _context) => {
  try {
    await load();

    await convertToGif();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
};

export { handler };

const load = async () => {
  await ffmpeg.load();
};

const convertToGif = async () => {
  ffmpeg.FS(
    "writeFile",
    "test.mp4",
    await fetchFile(
      "https://firebasestorage.googleapis.com/v0/b/dashreel-development.appspot.com/o/test%2FIMG_0052.MOV?alt=media&token=7a110c84-086e-4893-abef-94cca31d975e"
    )
  );

  await ffmpeg.run(
    "-i",
    "test.mp4",
    "-t",
    "2.5",
    "-ss",
    "2.0",
    "-f",
    "gif",
    "out.gif"
  );

  const data = ffmpeg.FS("readFile", "out.gif");

  await fs.writeFile("./test.gif", data);
};
