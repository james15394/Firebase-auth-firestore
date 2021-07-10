import { Button, TextField, withStyles } from "@material-ui/core";
import React from "react";

const CssTextField = withStyles({
  root: {
    "& .MuiInputLabel-outlined": { color: "#fff" },
    "& .MuiOutlinedInput-input": { color: "#fff" },
    "& label.Mui-focused": {
      color: "#fff",
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fff",
      },
      "&:hover fieldset": {
        borderColor: "#fff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
      },
    },
  },
})(TextField);

const Form = ({
  handleSubmit,
  type,
  className,
  value,
  title,
  setValue,
  setTitle,
}: {
  handleSubmit: (e: React.SyntheticEvent) => void;
  type: string;
  className: string | undefined;
  value: string | null;
  title: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const accept = value && title;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div>
        <CssTextField
          label="Title"
          variant="outlined"
          name="title"
          value={title}
          onChange={handleTitle}
          color="secondary"
        />
        <CssTextField
          label="Your post"
          multiline
          rows={3}
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
          {type === "edit" ? "Edit" : "Post"}
        </Button>
      </div>
    </form>
  );
};

export default Form;
