import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Typography } from "@material-ui/core";
import Firebase from "../../firebase";
import { db } from "../../firebase";
import Form from "../Form/Form";

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

  const handleClose = () => {
    setOpen(false);
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

            <Form
              className={classes.form}
              handleSubmit={handleSubmit}
              type="edit"
              value={value}
              title={title}
              setValue={setValue}
              setTitle={setTitle}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
