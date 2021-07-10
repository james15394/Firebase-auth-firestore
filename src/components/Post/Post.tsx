import { Button, Divider, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { db } from "../../firebase";
import EditModal from "../Modal/Modal";
import Firebase from "../../firebase";
import moment from "moment";
import { useUser } from "../context/UserContext";

const Post = ({ post }: { post: Firebase.firestore.DocumentData }) => {
  const user = useUser();
  const uid = user?.uid;
  const postUser = post?.name;
  const author = uid === postUser;
  const [open, setOpen] = React.useState(false);
  const deletePost = async (id: string) => {
    console.log(id);
    try {
      await db.collection("posts").doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Grid item xs={12} sm={6} className="post">
      <Paper variant="outlined">
        <Typography variant="h4" color="primary">
          {post?.title}
        </Typography>
        <Divider variant="fullWidth" />
        <p>
          <strong>Author: </strong>
          {post?.author}
        </p>
        <p>{moment(post?.lastUpdated?.toDate()).calendar()}</p>
        <Typography variant="h5">{post?.post}</Typography>
        {author && (
          <div className="btn">
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Edit
            </Button>
            {open && (
              <EditModal
                open={open}
                setOpen={setOpen}
                postId={post?.id}
                oldTitle={post?.title}
                content={post?.post}
              />
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => deletePost(post.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </Paper>
    </Grid>
  );
};

export default Post;
