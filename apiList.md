# DevTinder APIs

# authRouter
-  POST /signup
-  POST /login
-  POST /logout
# profileRouter
-  GET /profile/view
-  PATCH /profile/edit
-  PATCH /profile/password
# requestRouter
-  POST /request/send/:status/:userId
-  POST /request/review/:status/:request_id
# userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed

Status: ignored, interested, accepted, rejected