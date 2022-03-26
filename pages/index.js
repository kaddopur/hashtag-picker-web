import { useEffect, useState, useCallback } from 'react';
import { initFirebase } from '../lib/firebaseHelper';
import { getDatabase, onValue, query, ref } from 'firebase/database';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Home() {
  const [tagGroups, setTagGroups] = useState({});
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initFirebase();

    const db = getDatabase();
    const tagGroupsRef = query(ref(db, 'tagGroups'));
    onValue(
      tagGroupsRef,
      (snapshot) => {
        setTagGroups(snapshot.val());
      },
      {
        onlyOnce: false,
      }
    );
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const tagList = Object.keys(tagGroups)
        .filter((tagName) => data[tagName])
        .sort((a, b) => tagGroups[a].order - tagGroups[b].order)
        .map((tagName) => {
          return tagGroups[tagName].tags.map((tag) => `#${tag}`).join(' ');
        })
        .join('\n');

      setOpen(true);
      navigator.clipboard.writeText(tagList);
    },
    [tagGroups, data]
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hashtag Picker
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit}>
          {Object.keys(tagGroups).map((tagName) => {
            return (
              <div key={tagName}>
                <Stack direction="row">
                  <Checkbox
                    onChange={(e) => {
                      setData({
                        ...data,
                        [tagName]: e.target.checked,
                      });
                    }}
                  />
                  <Box>
                    {tagGroups[tagName].tags.map((tag) => {
                      return <Chip key={tag} sx={{ m: 0.5 }} label={tag} />;
                    })}
                  </Box>
                </Stack>
              </div>
            );
          })}
          <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              複製
            </Button>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              message="文字已複製"
              action={action}
            />
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
