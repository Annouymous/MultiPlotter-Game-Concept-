# Critical Multiplayer Game Fixes - Implementation Plan

## Issues Identified and Solutions

### Issue 1: Share Links Not Working (404 Errors)
**Problem**: Links like `/modes/online/16x16/ROOMID` show "page not found"
**Root Cause**: The dynamic route exists at `[room]/page.tsx` but doesn't handle direct URL access properly
**Solution**: 
- The route structure is correct: `/src/app/modes/online/16x16/[room]/page.tsx`
- Need to ensure the page properly extracts roomId from URL params
- Add proper error handling for invalid room IDs

### Issue 2: No Real-time Updates in Lobby
**Problem**: Players must reload to see other players join or mark ready
**Root Cause**: LobbyScreen component doesn't have Firebase real-time listener
**Solution**: Add onSnapshot listener in LobbyScreen for room updates

### Issue 3: Game Start Not Syncing
**Problem**: Players need to reload when host starts game
**Root Cause**: State transition from LOBBY → PLAYING not triggering re-render
**Solution**: Ensure OnlineGameBoard properly handles gameState changes in real-time listener

### Issue 4: Cards Not Flipping
**Problem**: Card flip logic broken
**Root Cause**: Need to verify HandleOnlineCardSystem in GameContext
**Solution**: Ensure card click handler properly calls handleMatchLogic

### Issue 5: Avatar Persistence Missing
**Problem**: Avatars show in lobby but disappear during game
**Root Cause**: Header and PlayerProfile components not displaying avatars during gameplay
**Solution**: Update components to consistently show avatars throughout game flow

## Implementation Steps

1. Fix dynamic route handling for direct URL access
2. Add real-time listener to LobbyScreen
3. Verify gameState transition handling
4. Fix card flip logic in GameContext
5. Add avatar display to Header and PlayerProfile during gameplay
6. Test all fixes with 2 players in different browsers