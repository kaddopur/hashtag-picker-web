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

export default function Home() {
  const [tagGroups, setTagGroups] = useState({});
  const [data, setData] = useState({});

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

      navigator.clipboard.writeText(tagList);
    },
    [tagGroups, data]
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
      <Box>
        <form onSubmit={handleSubmit}>
          {Object.keys(tagGroups).map((tagName) => {
            return (
              <div key={tagName}>
                <Checkbox
                  onChange={(e) => {
                    setData({
                      ...data,
                      [tagName]: e.target.checked,
                    });
                  }}
                />
                {tagGroups[tagName].tags.map((tag) => {
                  return <Chip sx={{ m: 0.5 }} label={tag} />;
                })}
              </div>
            );
          })}
          <Stack direction="row" justifyContent="center" sx={{ m: 2 }}>
            <Button variant="contained">複製</Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
