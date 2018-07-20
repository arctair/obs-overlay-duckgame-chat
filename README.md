# obs-overlay-duckgame-chat
It takes your Twitch chat and renders it like Duck Game chat anywhere. I use it as an OBS overlay.  
![Screenshot](https://github.com/arctair/arctair.github.io/blob/master/arctair/obs-overlay-duckgame-chat/screenshot.png?raw=true)

## Get started
Go to duckchat.arctair.com and follow its instruction.  

## Building the application for yourself
Why might you want to do this? You might want to add your own logic. You
might also want to add your own hats or change the username to hat lookup for
your viewers.
### Dependencies
Node v8.11.3

### Config
Grab all the duck game hats in PNG form and drop them into the src/hats holder.  
Reconfigure src/hats/index.js and src/users.js as needed.  

### Build and serve
`npm i`  
`npm run build`  
Now you need to serve the static files in `build` then connect an OBS browser source to your server.  
You can serve the files locally with `npx serve -s build` if you previously installed `serve` with `npm i -g serve`  
