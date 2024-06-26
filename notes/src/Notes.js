import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AddIcon from "@mui/icons-material/Add";
import Toolbar from "@mui/material/Toolbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import StyleIcon from "@mui/icons-material/Style";
import ClearIcon from "@mui/icons-material/Clear";
import AddTaskIcon from "@mui/icons-material/AddTask";
import emptyNotesIcon from "./assets/young woman pointing on new document button.svg";
import MarkAsUnreadSharpIcon from "@mui/icons-material/MarkAsUnreadSharp";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Input,
  Modal,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";

const drawerWidth = 240;
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};
const modalStyleTitle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const Notes = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showNotebookInput, setShowNotebookInput] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOptionsOpen, setModalOptionsOpen] = useState(false);
  const [modalTitleEdit, setModalTitleEdit] = useState(false);
  const [currentNotebookId, setCurrentNotebookId] = useState(null);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [modaleleteNoteBook, setModaleleteNoteBook] = useState(false);
  const [modalDeleteNote, setModalDeleteNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [editTitle, setEditTitle] = useState(true);
  const [modalOpenTitle, setModalOpenTitle] = useState(false);
  const [currentEditNoteId, setCurrentEditNoteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState("");
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const [editNoteDescription, setEditNoteDescription] = useState("");

  const notebookCollectionRef = collection(db, "NoteBook");

  const fetchNotebooks = async () => {
    const data = await getDocs(notebookCollectionRef);
    setNotebooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const fetchNotes = async (notebookId) => {
    try {
      if (!notebookId) {
        throw new Error("Notebook ID is not defined");
      }

      console.log("Fetching notes for notebook ID:", notebookId);

      const noteCollectionRef = collection(db, "NoteBook", notebookId, "Notes");
      const data = await getDocs(noteCollectionRef);

      const notesList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log("Fetched notes:", notesList);

      setNotes(notesList);
    } catch (error) {
      console.error("Error fetching notes: ", error.message);
      setSnackbarMessage(`Failed to fetch notes: ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    console.count("hello");
    fetchNotebooks();
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAddNotebook = async () => {
    console.count("hello1");
    if (newNotebookTitle.trim() === "") {
      setSnackbarMessage("Title Needed");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    await addDoc(notebookCollectionRef, { Title: newNotebookTitle });
    setSnackbarMessage("New Notebook Added");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    setNewNotebookTitle("");
    setShowNotebookInput(false);
    fetchNotebooks();
    setEditTitle(true);
  };

  const openModalTitleEdit = async () => {
    setModalTitleEdit(true);
    setModalOptionsOpen(false);
  };
  const editTitleNotebook = async (id) => {
    if (newNotebookTitle.trim() === "") {
      setSnackbarMessage("Title Needed");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const userDoc = doc(db, "NoteBook", id);
    const updateTitle = { Title: newNotebookTitle };
    await updateDoc(userDoc, updateTitle);

    setSnackbarMessage("Notebook Title Updated");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    setNewNotebookTitle("");
    setShowNotebookInput(false);
    setModalOptionsOpen(false);
    setModalTitleEdit(false);
    fetchNotebooks();
  };
  // function for open edit notes modal
  const handleOpenEditModal = (note) => {
    setEditNoteId(note.id);
    setEditNoteTitle(note.title);
    setEditNoteDescription(note.description);
    setEditModalOpen(true);
  };
  // const fetchNotes = () => {
  //   // Placeholder function for fetching notes
  //   console.log("Fetching notes...");
  // };
  // function for open edit notes
  const editNote = async (id) => {
    if (editNoteTitle.trim() === "" || editNoteDescription.trim() === "") {
      setSnackbarMessage("Both Title and Description Needed");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      console.log("Updating note with ID:", id);
      console.log("Current Notebook ID:", currentNotebookId);

      if (!currentNotebookId) {
        throw new Error("Current Notebook ID is not set");
      }

      if (!id) {
        throw new Error("Note ID is not set");
      }

      const noteDoc = doc(db, "NoteBook", currentNotebookId, "Notes", id);
      console.log("Firestore path:", noteDoc.path);

      const updatedNote = {
        title: editNoteTitle,
        description: editNoteDescription,
      };

      await updateDoc(noteDoc, updatedNote);

      setSnackbarMessage("Note Updated Successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Reset the form and close the modal
      setEditNoteId("");
      setEditNoteTitle("");
      setEditNoteDescription("");
      setEditModalOpen(false);

      // Optionally, refresh the notes list or update the state to reflect the changes
      fetchNotes(currentNotebookId);
    } catch (error) {
      console.error("Error updating note: ", error.message);
      setSnackbarMessage(`Failed to update note: ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const handleModalReadNote = (id) => {
    setModalOpenTitle(true);
    setCurrentEditNoteId(id);
    console.log(notes?.filter((note) => note.id === id)[0].title);
  };
  const handleModalDelete = (id) => {
    setModaleleteNoteBook(true);
    setModalOptionsOpen(false);
  };

  const handleDeleteNotebook = async (id) => {
    try {
      // Fetch notes associated with the notebook
      const notesQuerySnapshot = await getDocs(
        collection(db, "NoteBook", id, "Notes")
      );

      // Delete each note
      const deleteNotePromises = notesQuerySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await Promise.all(deleteNotePromises); // Wait for all notes to be deleted

      // Delete the notebook
      await deleteDoc(doc(db, "NoteBook", id));

      // Display success message
      setSnackbarMessage("Notebook Deleted");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setModaleleteNoteBook(false);
      // Refresh notebooks and notes
      fetchNotebooks();
      fetchNotes(currentNotebookId);
    } catch (error) {
      console.error("Error deleting notebook: ", error);
      setSnackbarMessage("Failed to delete notebook");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleModalDelteNote = (id) => {
    setModalDeleteNote(true);
    setCurrentNoteId(id);
    console.log(currentNoteId, "note");
  };

  const handleDeleteNote = async (id) => {
    console.log(id);
    await deleteDoc(doc(db, "NoteBook", currentNotebookId, "Notes", id));
    setSnackbarMessage("Note Deleted");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
    setModalDeleteNote(false);
    fetchNotes(currentNotebookId);
  };
  const handleModalCloseNote = async () => {
    setModalOptionsOpen(true);
    setModalOpen(false);
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.description.trim()) {
      setSnackbarMessage("Title and Description Needed");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const noteCollectionRef = collection(
      db,
      "NoteBook",
      currentNotebookId,
      "Notes"
    );
    await addDoc(noteCollectionRef, newNote);
    setSnackbarMessage("New Note Added");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    setNewNote({ title: "", description: "" });
    setModalOpen(false);
    fetchNotes(currentNotebookId);
  };

  const openNoteModal = (notebookId) => {
    setCurrentNotebookId(notebookId);
    setModalOptionsOpen(false);
    setModalOpen(true);
  };

  const openOptionsModal = (notebookId, newNotebookTitle) => {
    setNewNotebookTitle(newNotebookTitle);
    setCurrentNotebookId(notebookId);
    setModalOptionsOpen(true);
    console.log(newNotebookTitle, "hello");
  };

  const selectNotebook = (notebookId) => {
    setCurrentNotebookId(notebookId);
    fetchNotes(notebookId);
  };
  const handleCancelDeleteNoteBook = () => {
    setModaleleteNoteBook(false);
    setModalOptionsOpen(true);
  };
  const handleCancelDeleteNote = () => {
    setModalDeleteNote(false);
  };
  const handleCancelEditTitle = () => {
    setModalTitleEdit(false);
    setModalOptionsOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#FED18D",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Box>
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: "2vh",
                width: "70%",
                m: "20px 0px 20px 10px",
                backgroundColor: "rgba(245, 166, 35, 1)",
                color: "#000",
                borderRadius: "200px",
                boxShadow: "0px 0px 7px 1px rgba(77,77,77,1)",
                "&:hover": {
                  backgroundColor: "rgba(245, 166, 35, 1)",
                  boxShadow: "0px 0px 15px 3px rgba(77,77,77,1)",
                },
              }}
              onClick={() => setShowNotebookInput(true)}
            >
              <AddIcon sx={{ fontSize: "20px", mr: "2vh" }} />
              <Typography sx={{ fontSize: "12px" }}>New Notebook</Typography>
            </Button>
          </Box>
          <Divider />
          {showNotebookInput && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                p: "5px 10px",
                borderRadius: "200px",
                backgroundColor: "rgba(245, 166, 35, 1)",
                my: "10px",
                color: "#000",
                "&:hover": {
                  backgroundColor: "rgba(245, 166, 35, 1)",
                  boxShadow: "0px 0px 5px 1px rgba(77,77,77,1)",
                },
              }}
            >
              <Input
                value={newNotebookTitle}
                onChange={(event) => setNewNotebookTitle(event.target.value)}
                placeholder="Enter Title"
                disableUnderline
              />
              <Tooltip title="Cancel NoteBook">
                <ClearIcon
                  sx={{ cursor: "pointer", mr: "10px" }}
                  onClick={() => setShowNotebookInput(false)}
                />
              </Tooltip>
              <Tooltip title="Save NoteBook">
                <AddTaskIcon
                  sx={{ cursor: "pointer", mr: "10px" }}
                  onClick={handleAddNotebook}
                />
              </Tooltip>
            </Box>
          )}
          <Divider />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Box>
            {notebooks.map((notebook) => (
              <Box key={notebook.id}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "10px",
                    borderRadius: "200px",

                    backgroundColor:
                      notebook.id === currentNotebookId
                        ? "#5AB2FF"
                        : "rgba(245, 166, 35, 1)",
                    my: "10px",
                    color: "#000",
                    "&:hover": {
                      //   backgroundColor: "rgba(245, 166, 35, 1)",
                      boxShadow: "0px 0px 5px 1px rgba(77,77,77,1)",
                    },
                    ":active": {
                      color: "#fff",
                    },
                  }}
                  onClick={() => selectNotebook(notebook.id)}
                >
                  <Box sx={{ paddingLeft: "15px" }}>
                    <Typography>{notebook.Title}</Typography>
                  </Box>

                  <Box sx={{ paddingRight: "15px" }}>
                    <Tooltip title="See Options">
                      <StyleIcon
                        sx={{ cursor: "pointer", fontSize: "25px" }}
                        onClick={() =>
                          openOptionsModal(notebook.id, notebook.Title)
                        }
                      />
                    </Tooltip>
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container>
          {/* {notes.map((note) => (
            <Grid key={note.id} item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  maxWidth: 345,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: "10px",
                  border: "1px solid rgba(255, 255, 255, .25)",
                  borderRadius: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.45)",
                  boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.25)",
                  backdropFilter: "blur(15px)",
                  m: "3%",
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {note.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {note.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "10px",
                  }}
                >
                  <Tooltip title="Edit Note">
                    <EditIcon
                      sx={{ cursor: "pointer", fontSize: "20px", mx: "10px" }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete Note">
                    <DeleteIcon
                      sx={{ cursor: "pointer", fontSize: "20px", mr: "10px" }}
                      onClick={() => handleDeleteNote(note.id)}
                    />
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))} */}
          <Grid
            container
            spacing={2}
            // sx={{ display: "flex", justifyContent: "center" }}
          >
            {notes.length === 0 ? (
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    mt: 5,
                  }}
                >
                  <Box
                    component="img"
                    src={emptyNotesIcon}
                    sx={{
                      width: 700,
                      height: 500,
                      marginBottom: "20px",
                    }}
                  />
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    sx={{ textAlign: "center" }}
                  >
                    No notes available
                  </Typography>
                </Box>
              </Grid>
            ) : (
              notes.map((note) => (
                <Grid key={note.id} item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      display: "flex",
                      height: "200px",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: "10px",
                      border: "1px solid rgba(255, 255, 255, .25)",
                      borderRadius: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.45)",
                      boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(15px)",
                      m: "3%",
                    }}
                  >
                    <CardActionArea>
                      <CardContent sx={{ flexGrow: 1, overflow: "scroll" }}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          noWrap
                        >
                          {note.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {note.description && note.description.length > 80
                            ? `${note.description.slice(0, 97)}...`
                            : note.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "10px",
                      }}
                    >
                      <Tooltip title="Read Note">
                        <MarkAsUnreadSharpIcon
                          sx={{
                            cursor: "pointer",
                            fontSize: "20px",
                            mx: "10px",
                          }}
                          onClick={() => handleModalReadNote(note.id)}
                        />
                      </Tooltip>
                      <Tooltip title="Edit Note">
                        <EditIcon
                          sx={{
                            cursor: "pointer",
                            fontSize: "20px",
                            mx: "10px",
                          }}
                          onClick={() => handleOpenEditModal(note)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete Note">
                        <DeleteIcon
                          sx={{
                            cursor: "pointer",
                            fontSize: "20px",
                            mr: "10px",
                          }}
                          //   onClick={() => handleDeleteNote(note.id)}
                          onClick={() => handleModalDelteNote(note.id)}
                        />
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {/* Notes Modal */}
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Box sx={{ marginBottom: "20px" }}>
                <TextField
                  label="Enter title"
                  size="medium"
                  fullWidth
                  multiline
                  InputProps={{
                    sx: { borderRadius: "0px", width: "100%" },
                  }}
                  value={newNote.title}
                  onChange={(event) =>
                    setNewNote({ ...newNote, title: event.target.value })
                  }
                />
              </Box>
              <TextField
                label="Enter description"
                size="medium"
                fullWidth
                rows={7}
                multiline
                InputProps={{
                  sx: { borderRadius: "0px", width: "100%" },
                }}
                value={newNote.description}
                onChange={(event) =>
                  setNewNote({ ...newNote, description: event.target.value })
                }
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  sx={{ marginRight: "10px" }}
                  variant="outlined"
                  color="error"
                  // onClick={() => setModalOpen(false)}
                  onClick={handleModalCloseNote}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddNote}
                >
                  Save Note
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* Edit Notes  */}
          <Modal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            aria-labelledby="edit-modal-title"
            aria-describedby="edit-modal-description"
          >
            <Box sx={modalStyle}>
              <Box sx={{ marginBottom: "20px" }}>
                <TextField
                  label="Edit title"
                  size="medium"
                  fullWidth
                  multiline
                  InputProps={{
                    sx: { borderRadius: "0px", width: "100%" },
                  }}
                  value={editNoteTitle}
                  onChange={(event) => setEditNoteTitle(event.target.value)}
                />
              </Box>
              <TextField
                label="Edit description"
                size="medium"
                fullWidth
                rows={7}
                multiline
                InputProps={{
                  sx: { borderRadius: "0px", width: "100%" },
                }}
                value={editNoteDescription}
                onChange={(event) => setEditNoteDescription(event.target.value)}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  sx={{ marginRight: "10px" }}
                  variant="outlined"
                  color="error"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => editNote(editNoteId)}
                >
                  Save Note
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Notebokk Options Modal */}
          <Modal
            open={modalOptionsOpen}
            onClose={() => setModalOptionsOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyleTitle}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    width: "max-content",
                    p: "10px 20px",
                    borderRadius: "200px",
                    backgroundColor: "rgba(245, 166, 35, 1)",
                    mx: "10px",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "rgba(245, 166, 35, 1)",
                      boxShadow: "0px 0px 5px 1px rgba(77,77,77,1)",
                    },
                  }}
                >
                  {newNotebookTitle}
                </Typography>
                <Box>
                  <Button
                    sx={{ marginRight: "10px" }}
                    variant="contained"
                    color="info"
                    onClick={() => openModalTitleEdit()}
                  >
                    <EditIcon
                      sx={{
                        cursor: "pointer",
                        fontSize: "20px",
                        marginRight: "10px",
                      }}
                    />
                    Edit Title
                  </Button>
                </Box>

                <Button
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  color="error"
                  onClick={() => handleModalDelete(currentNotebookId)}
                  //   onClick={() => handleModalDelteNote(currentNotebookId)}
                >
                  <DeleteIcon
                    sx={{
                      cursor: "pointer",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  />
                  Delete Notebook
                </Button>

                <Button
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  color="success"
                  onClick={() => openNoteModal(currentNotebookId)}
                >
                  <AddIcon
                    sx={{
                      cursor: "pointer",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  />
                  Add Notes
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* NoteBook confirmation Deelte */}
          <Modal
            open={modaleleteNoteBook}
            onClose={() => setModaleleteNoteBook(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyleTitle}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography>
                  Are you sure , you want to delete {newNotebookTitle} Notebook
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Button
                    sx={{ marginRight: "10px" }}
                    variant="contained"
                    color="info"
                    // onClick={() => setModaleleteNoteBook(false)}
                    onClick={() => handleCancelDeleteNoteBook()}
                  >
                    Cancel
                  </Button>
                </Box>

                <Button
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteNotebook(currentNotebookId)}
                >
                  <DeleteIcon
                    sx={{
                      cursor: "pointer",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  />
                  Delete Notebook
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* Notes Confirmation Delete */}
          <Modal
            open={modalDeleteNote}
            onClose={() => setModalDeleteNote(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyleTitle}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography>
                  Are you sure , you want to delete current Note
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Button
                    sx={{ marginRight: "10px" }}
                    variant="contained"
                    color="info"
                    // onClick={() => setModaleleteNoteBook(false)}
                    onClick={() => handleCancelDeleteNote()}
                  >
                    Cancel
                  </Button>
                </Box>

                <Button
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteNote(currentNoteId)}
                >
                  <DeleteIcon
                    sx={{
                      cursor: "pointer",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  />
                  Delete Note
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* NoteBook Edit title */}
          <Modal
            open={modalTitleEdit}
            onClose={() => setModalTitleEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Box sx={{ marginBottom: "20px" }}>
                <TextField
                  label="Edit title"
                  size="medium"
                  fullWidth
                  multiline
                  InputProps={{
                    sx: { borderRadius: "0px", width: "100%" },
                  }}
                  value={newNotebookTitle}
                  onChange={(event) => setNewNotebookTitle(event.target.value)}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  sx={{ marginRight: "10px" }}
                  variant="outlined"
                  color="error"
                  //   onClick={() => setModalTitleEdit(false)}
                  onClick={() => handleCancelEditTitle()}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => editTitleNotebook(currentNotebookId)}
                >
                  Save Title
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* Read Note  */}
          <Modal
            open={modalOpenTitle}
            onClose={() => setModalOpenTitle(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Box sx={{ marginBottom: "20px" }}>
                <TextField
                  label="Enter title"
                  size="medium"
                  fullWidth
                  multiline
                  InputProps={{
                    sx: { borderRadius: "0px", width: "100%" },
                  }}
                  value={
                    notes?.filter((note) => note.id === currentEditNoteId)[0]
                      ?.title || " "
                  }
                />
              </Box>
              <TextField
                label="Enter description"
                size="medium"
                fullWidth
                rows={7}
                multiline
                InputProps={{
                  sx: { borderRadius: "0px", width: "100%" },
                }}
                value={
                  notes?.filter((note) => note?.id === currentEditNoteId)[0]
                    ?.description || " "
                }
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  color="error"
                  // onClick={() => setModalOpen(false)}
                  onClick={() => setModalOpenTitle(false)}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Modal>
        </Grid>
      </Box>
    </Box>
  );
};

export default Notes;
