# Procedure

You need a link layer so that remote devices can communicate with each other. The communication takes place via events such as See Candidates, Send Connection Data, etc. The communication can be done e.g. via WebSockets, SSE, Polling, or similar. If you want to connect more than two candidates you have to make sure that the events for one candidate only arrive at this candidate, you can realize this with server and client side filters or private channels.

It must be ensured that old, already processed messages are not processed a 2nd time. 

The library provides a CallService in which the status of the connected users is noted. The status contains, for example, whether a user has a camera and this is currently active. To determine a user, a user identifier is passed to the library. 

