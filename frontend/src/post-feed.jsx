import React from "react";
import "./post-feed.css";
import { Button, TextField } from "@mui/material";
import imageProfile from "./images/avatar.png";
import { AuthContext } from "./context/AuthContext";

import {
  Card,
  CardActionArea,
  Typography,
  CardActions,
  Avatar,
} from "@mui/material";
import { doAddPost, getPost } from "./api-call/api";

