import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Button, Typography } from "@material-ui/core";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import Firebase from "../../firebase";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      placeItems: "center",
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
      "& > div": {
        maxWidth: 500,
        display: "flex",
        flexDirection: "column",
      },
    },
  })
);

const Home = () => {
  const user = useUser();
  console.log(user);
  const classes = useStyles();
  const [value, setValue] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string | null>(null);
  const [posts, setPosts] = React.useState<
    Firebase.firestore.DocumentData[] | null
  >(null);
  const accept = value && title;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      post: { value: string };
      title: { value: string };
    };
    const post = target.post.value;
    const title = target.title.value;
    console.log(post);
    const postItem = {
      name: user?.uid,
      title,
      post,
      author: user?.email,
      id: uuidv4(),
      createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdated: Firebase.firestore.FieldValue.serverTimestamp(),
    };
    db.collection("posts")
      .doc(postItem.id)
      .set(postItem)
      .catch((err) => console.log(err));
    setValue("");
    setTitle("");
  };
  useEffect(() => {
    const unsub = db
      .collection("posts")
      // .where("name", "==", user?.uid)
      .onSnapshot((querySnapshot) => {
        const items: Firebase.firestore.DocumentData[] | null = [];
        console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setPosts(items);
      });
    return unsub;
  }, []);
  return (
    <div>
      <h1>Post</h1>
      <p>{user?.email}</p>
      <form className={classes.root} onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Title"
            variant="outlined"
            name="title"
            value={title}
            onChange={handleTitle}
          />
          <TextField
            label="Your post"
            multiline
            rows={4}
            variant="outlined"
            name="post"
            value={value}
            onChange={handleChange}
          />
          <Button
            type="submit"
            color="primary"
            fullWidth
            variant="contained"
            disabled={!Boolean(accept)}
          >
            Post
          </Button>
        </div>
      </form>
      <div className="posts">
        {posts?.map((post) => (
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
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default Home;
