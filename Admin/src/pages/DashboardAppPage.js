import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Popover,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Checkbox,
  IconButton,
  TextField,
  
} from '@mui/material';
import Scrollbar from '../components/scrollbar';
import { UserListToolbar } from '../sections/@dashboard/user';
import Iconify from '../components/iconify'; // Import Iconify component


export default function UserPage() {
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [importMessage, setImportMessage] = useState('');
  const [userData, setUserData] = useState([]);
  const [updatePopoverOpen, setUpdatePopoverOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({
    name: '',
    email: '',
    course: '',
  });

  const handleFilterByName = (event) => {
    setSelected([]);
    setFilterName(event.target.value);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setImportMessage('');
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setImportMessage('');
  };

  const handleUpload = async () => {
    try {
      const fileInput = document.querySelector('#file-input');
      const file = fileInput.files[0];

      if (file) {
        const formData = new FormData();
        formData.append('excelFile', file);

        const response = await fetch('https://data-excel.onrender.com/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setImportMessage('File uploaded successfully');
        } else {
          setImportMessage('Failed to upload file');
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setImportMessage('Error uploading file');
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://data-excel.onrender.com/data');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`https://data-excel.onrender.com/delete/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedUserData = userData.filter((user) => user._id !== userId);
        setUserData(updatedUserData);
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const userIds = userData.map((user) => user._id);
      setSelected(userIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (userId) => {
    if (selected.includes(userId)) {
      setSelected(selected.filter((id) => id !== userId));
    } else {
      setSelected([...selected, userId]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({
      name: user.name,
      email: user.email,
      course: user.course,
    });
    setUpdatePopoverOpen(true);
    setAnchorEl(document.getElementById(user._id)); // Make sure user._id corresponds to a valid DOM element
  };

  const handleUpdatePopoverClose = () => {
    setSelectedUser(null);
    setUpdatedUserData({
      name: '',
      email: '',
      course: '',
    });
    setUpdatePopoverOpen(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://data-excel.onrender.com/update/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Make sure this line is present
        },
        body: JSON.stringify(updatedUserData),
     
      
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const updatedUsers = userData.map((user) => (user._id === updatedUser._id ? updatedUser : user));
        setUserData(updatedUsers);
        console.log('User updated successfully');
        handleUpdatePopoverClose();
      } else {
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const isPopoverOpen = Boolean(anchorEl);
  
  const handleDeleteSelected = async () => {
    try {
      const response = await fetch('https://data-excel.onrender.com/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds: selected }),
      });

      if (response.ok) {
        const deletedUsers = await response.json();
        // Filter out the deleted users from userData
        const updatedUserData = userData.filter((user) => !selected.includes(user._id));
        setUserData(updatedUserData);
        setSelected([]); // Clear the selected array after deletion
        console.log('Selected users deleted successfully');
      } else {
        console.error('Failed to delete selected users:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting selected users:', error);
    }
  };

  
  return (
    <>
      <Helmet>
        <title> Hoping Minds </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" onClick={handleOpenPopover}>
            Upload Data
          </Button>
          
        </Stack>

        <Card>
        <Button
        variant="contained"
        onClick={handleDeleteSelected}
        style={{ backgroundColor: '#f44336', color: 'white', margin:'10px' , marginLeft:'950px'  }}
        disabled={selected.length === 0}
      >
        Delete Selected
      </Button>
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < userData.length}
                        checked={selected.length === userData.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={selected.includes(user._id)}
                          onChange={() => handleSelectOne(user._id)}
                        />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.course}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleUpdateUser(user)}>
                          <Iconify icon={'eva:edit-outline'} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteUser(user._id)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
        
      </Container>

      {/* Popover */}
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Upload Excel File
          </Typography>
          <input id="file-input" type="file" accept=".xlsx, .xls" style={{ marginBottom: '10px' }} />
          <Button
            variant="contained"
            onClick={handleUpload}
            style={{ width: '100%', marginBottom: '10px', backgroundColor: '#4caf50', color: 'white' }}
          >
            Upload
          </Button>
          <Button variant="outlined" onClick={handleClosePopover} style={{ width: '100%' }}>
            Cancel
          </Button>
          {importMessage && (
            <Typography
              variant="body1"
              style={{ marginTop: '10px', color: importMessage.startsWith('File uploaded') ? 'green' : 'red' }}
            >
              {importMessage}
            </Typography>
          )}
        </div>
      </Popover>

      <Popover
        open={updatePopoverOpen}
        anchorEl={anchorEl}
        onClose={handleUpdatePopoverClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Typography variant="h6" gutterBottom>
    Update User
  </Typography>
  <form onSubmit={handleUpdateSubmit}>
    <div style={{ paddingBottom: '10px' }}>
      <TextField
        label="Name"
        name="name"
        value={updatedUserData.name}
        onChange={(e) => setUpdatedUserData({ ...updatedUserData, name: e.target.value })}
      />
    </div>
    <div style={{ paddingBottom: '10px' }}>
      <TextField
        label="Email"
        name="email"
        value={updatedUserData.email}
        onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
      />
    </div>
    <div style={{ paddingBottom: '10px' }}>
      <TextField
        label="Course"
        name="course"
        value={updatedUserData.course}
        onChange={(e) => setUpdatedUserData({ ...updatedUserData, course: e.target.value })}
      />
    </div>
    <Button type="submit" variant="contained" color="primary">
      Update
    </Button>
  </form>
</div>

      </Popover>
    </>
  );
}
