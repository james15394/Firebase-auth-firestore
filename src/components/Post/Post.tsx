import { Button, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { db } from "../../firebase";
import EditModal from "../Modal/Modal";
import Firebase from "../../firebase";

const Post = ({ post }: { post: Firebase.firestore.DocumentData }) => {
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
    <Grid item xs={12} sm={6} className="post" key={post.id}>
      <Paper variant="outlined">
        <Typography variant="h4" color="primary">
          {post?.title}
        </Typography>
        <Typography variant="h6">{post?.author}</Typography>
        <Typography variant="h6">
          {new Date(
            new Date(post?.createdAt?.seconds * 1000)
          ).toLocaleDateString()}
        </Typography>
        <p>{post?.post}</p>
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
      </Paper>
    </Grid>
  );
};

export default Post;
