import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Button, TextField, Typography } from "@material-ui/core";
import Firebase from "../../firebase";
import { db } from "../../firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
  })
);

export default function EditModal({
  open,
  setOpen,
  postId,
  oldTitle,
  content,
}: {
  open: boolean;
  setOpen: any;
  postId: string;
  oldTitle: string;
  content: string;
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState<string | null>(content);
  const [title, setTitle] = React.useState<string | null>(oldTitle);
  const accept = value && title;

  const handleClose = () => {
    setOpen(false);
  };
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
    const postItem = {
      title,
      post,
      lastUpdated: Firebase.firestore.FieldValue.serverTimestamp(),
    };
    db.collection("posts")
      .doc(postId)
      .update(postItem)
      .catch((err) => console.log(err));
    setValue("");
    setTitle("");
    setOpen(false);
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography variant="h5">Edit Post</Typography>
            <form onSubmit={handleSubmit}>
              <div className={classes.form}>
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
                  Edit
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
