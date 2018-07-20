# obs-overlay-duckgame-chat
It takes your Twitch chat and renders it like Duck Game chat anywhere (not just OBS, I suppose)
![Screenshot](https://github.com/arctair/arctair.github.io/blob/master/arctair/obs-overlay-duckgame-chat/screenshot.png?raw=true)

## Dependencies
Node v8.11.3

## Config
Copy config.js.template to config.js. Fill out `channel` with your channel name.  
Grab all the duck game hats in PNG form and drop them into the src/hats holder.  

## Build and serve
`npm i`  
`npm run build`  
Now you need to serve the static files in `build` then connect an OBS browser source to your server.  
You can serve the files locally with `npx serve -s build` if you previously installed `serve` with `npm i -g serve`  
