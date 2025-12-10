# dontdraw, a collaborative drawing application - TODO

## Core

- [ ] Setup NestJS project: Install NestJS CLI, create new project with Express engine, install dependencies (WebSocket, Prisma, JWT), run initial build
- [ ] Configure Prisma with SQLite: Initialize Prisma, define User model in schema.prisma (only for auth later), generate client, create database file
- [ ] Implement room routing: Create a route handler for /[slug], add logic to auto-create/join rooms in-memory (no DB yet), handle room not found
- [ ] Setup WebSocket gateway: Install @nestjs/websockets, create a basic gateway module, handle connection/disconnection events, broadcast to rooms
- [ ] Implement basic drawing: Add stroke data structure (coordinates, color), handle incoming strokes from clients, broadcast to all users in room, rate-limit to prevent spam
- [ ] Create frontend canvas: Use plain HTML/JS, draw on canvas with mouse events, send strokes via WebSocket, receive and render strokes from others
- [ ] Add anonymous users: Generate random names on join (e.g., "Anon_1234"), display list of active users in room on frontend, update on join/leave
- [ ] Test collaboration: Open multiple browser tabs, verify drawing syncs and user list updates, fix any real-time bugs

## Auth + Polish

- [ ] Implement auth endpoints: Create register and login controllers, use bcrypt for passwords, generate JWT tokens, store users in Prisma SQLite
- [ ] Add JWT verification: Install passport-jwt, create auth guard, verify tokens on HTTP requests
- [ ] Verify tokens on WebSocket: Modify gateway to check JWT on connection, reject invalid tokens, allow anonymous connections
- [ ] Add custom username/color: Update User model for username and color fields, create endpoint for logged-in users to set these, apply in WebSocket events
- [ ] Implement live cursor tracking: Add cursor position data to WebSocket messages, broadcast positions on mousemove, render cursors on canvas with fade-out after 5s inactivity
- [ ] Create custom pipe: Build a pipe to validate stroke data (e.g., coordinate bounds, valid colors), throw errors for invalid data
- [ ] Create custom interceptor: Build an interceptor to log WebSocket events with timestamps, measure execution time if needed
- [ ] Polish frontend: Add basic responsive CSS for canvas and user list, handle window resize, add clear canvas button (anyone can use)
- [ ] Final testing and fixes: Test full flow (anon drawing, login, custom features, cursors), fix bugs, ensure no crashes with 10 users
