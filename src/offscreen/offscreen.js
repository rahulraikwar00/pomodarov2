const audioElement = document.createElement("audio");
document.body.appendChild(audioElement);

const stations = [
  {
    name: "Lofi 24/7",
    uri: "https://usa9.fastcast4u.com/proxy/jamz?mp=/1",
    gif: "https://media0.giphy.com/media/dvreHY4p06lzVSDrvj/giphy.gif",
  },
  {
    name: "Planet LoFi",
    uri: "http://198.245.60.88:8080/stream",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjBkbHc5ejB3dTI3MnNjYXlydjVkanNtMnd1NDQwbDV3OG03bml4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H62NM1ab7wzMXURdoi/giphy.gif",
  },
  {
    name: "ChillHop",
    uri: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/",
    gif: "https://media0.giphy.com/media/MU56lYT1Ov07fVTsnM/giphy.gif",
  },
  {
    name: "Chillsky",
    uri: "https://lfhh.radioca.st/stream",
    gif: "https://media0.giphy.com/media/XbJYBCi69nyVOffLIU/giphy.gif",
  },
  {
    name: "RauteMusik FM Study",
    uri: "http://de-hz-fal-stream07.rautemusik.fm/study",
    gif: "https://media0.giphy.com/media/XbJYBCi69nyVOffLIU/giphy.gif",
  },
  {
    name: "I Love Chillhop",
    uri: "https://streams.ilovemusic.de/iloveradio17.mp3",
    gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzg4aDBmb2hucnR4N3MzMWF1cjE0dWtkMmxyZDNsNHhqc2htbHluOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WTiJwq5cEY1gsRHJt9/giphy.gif",
  },
  {
    name: "Radio Record Lo-Fi",
    uri: "https://radiorecord.hostingradio.ru/lofi96.aacp",
    gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3plNGtidXl2cjgyZDVqMWQxeGZ2eHFqc2c5ZXpuY3pjbGt6dHl4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LzinRMeoxdpAt6w2n7/giphy.gif",
  },
];

let audioStation = "Lofi 24/7";

audioElement.src = stations.find(
  (station) => station.name === audioStation
).uri;
chrome.runtime.onMessage.addListener((message) => {
  console.log("[controller]: received", message);

  switch (message.type) {
    case "updateStation":
      const audioStation = message.payload.selectedStation;
      audioElement.src = stations.find(
        (station) => station.name === audioStation
      ).uri;
      console.log("audio station updated and now playing", audioStation);
      audioElement.play();
      break;
    case "play":
      audioElement.play();
      break;
    case "pause":
      audioElement.pause();
      break;
    default:
      console.log(`Unknown message type: ${message.type}`);
  }

  return true;
});
