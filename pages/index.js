import { useEffect, useState, useCallback } from 'react';
import { initFirebase } from '../lib/firebaseHelper';
import { getDatabase, onValue, query, ref, set } from 'firebase/database';

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
    <form onSubmit={handleSubmit}>
      {Object.keys(tagGroups).map((tagName) => {
        return (
          <div key={tagName}>
            <input
              type="checkbox"
              onChange={(e) => {
                setData({
                  ...data,
                  [tagName]: e.target.checked,
                });
              }}
            ></input>
            {tagGroups[tagName].tags.map((tag) => {
              return <span key={tag}>{tag}</span>;
            })}
          </div>
        );
      })}
      <input type="submit" value="複製" />
    </form>
  );
}
