import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import Firebase from "../../firebase";
import Post from "../Post/Post";
import Form from "../Form/Form";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    root: {
      display: "grid",
      placeItems: "center",
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
      "& > div": {
        maxWidth: 700,
        display: "flex",
        flexDirection: "column",
      },
    },
    posts: {
      margin: 20,
      "& .post": {
        maxWidth: 400,

        "& .MuiPaper-outlined": {
          padding: theme.spacing(1),
          minHeight: 200,
          display: "grid",
          placeItems: "center",
          background: "rgb(226 206 206 / 54%)",
          "& hr": {
            width: "100%",
          },
        },
      },
      "& .MuiGrid-spacing-xs-3": {
        placeContent: "center",
      },
    },
  })
);

const Home = () => {
  const user = useUser();
  const classes = useStyles();
  const [value, setValue] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string | null>(null);
  const [posts, setPosts] = React.useState<
    Firebase.firestore.DocumentData[] | null
  >(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      post: { value: string };
      title: { value: string };
    };
    const post = target.post.value;
    const title = target.title.value;
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
  if (!user) {
    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  }
  return (
    <div className={classes.container}>
      <h1>Post</h1>
      <p>{user?.email}</p>

      <Form
        handleSubmit={handleSubmit}
        type="newPost"
        className={classes.root}
        value={value}
        title={title}
        setValue={setValue}
        setTitle={setTitle}
      />
      <div className={classes.posts}>
        <Grid container spacing={3}>
          {posts?.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Home;
