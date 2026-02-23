## Inspiration

Every day on the road, we see cute innocent creatures that unfortunately lost their lives due to drivers who did not see
them out on the roads. We built this website/app so that awareness can be brought to this issue so that we can try to
reduce the impact of humans on animals.

## What it does

It's a multi-user live map where users can add markers that mark the locations of animals spotted. The markers also
contain a description of the animal(s).

## How we built it

- **Frontend:** Built with Next.js and React. We used Tailwind CSS for quick styling and shadcn/ui for quick components.
- **Mapping:** Powered by Leaflet and React-Leaflet, allowing for custom popups while being free.
- **Multi-User:** Implemented via Socket.io. This allows for a low-latency requests while having the same data as the
  server.

## Accomplishments that we're proud of

We're proud of being able to make a proper front design and also create a working map. (Honestly just everything about
this project).

## Challenges we ran into

We ran into some issues when implementing the multi-user features. It was slow to repeatedly ask the server for the
markers, so we had to use socket.io to easily manage communication between the server and the client. Additionally,
sending all of the makers every time that they were updated was slow and unnecessary, and we had to implement updates
that only added new content.

## What we learned

Through this project, we learned a lot about how to effectively build a backend server that continuously communicates
with the frontend and ensures that the data is consistent, even when there's sketchy internet.

## What's next for Wildlife Tracker

In the future, some additional features that we could add include:

- **AI Species Recognition:* Using the images that are already stored in the server, we could add more accuracy to the
  species identification using a computer vision model.
- **Better Storage:** Using a database to store the data, allowing for persistent memory across multiple runs.
- **Filters:** Show specific species or filter based on geographical locations.
- **Mobile Apps:** Create a mobile app that makes reporting even easier, making Wildlife Tracker more widespread and
  accessible. 
