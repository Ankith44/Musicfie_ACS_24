import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function DatabaseSelector() {
  const [selectedOption, setSelectedOption] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleLoadData = async () => {
    if (selectedOption === 'firestore') {
      setLoading(true);
      try {
        const snapshot = await db.collection('simple').get();
        const fetchedSongs = snapshot.docs.map(doc => doc.data());
        setSongs(fetchedSongs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Please select Firestore as the option.');
    }
  };

  const handleBulkUpload = async () => {
    setLoading(true);
    try {
      const jsonData = [
        {
          "id": 0,
          "artist_name": "mukesh",
          "track_name": "mohabbat bhi jhoothi",
          "release_date": 1950,
          "genre": "pop",
          "topic": "sadness"
        },
        {
          "id": 4,
          "artist_name": "frankie laine",
          "track_name": "i believe",
          "release_date": 1950,
          "genre": "pop",
          "topic": "world/life"
        }
      ];
      const batch = db.batch();
      jsonData.forEach(data => {
        const docRef = db.collection('simple').doc(); // Auto-generated ID
        batch.set(docRef, data);
      });
      await batch.commit();
      console.log('Bulk data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading bulk data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <input
          type="radio"
          id="firestore"
          name="databaseOption"
          value="firestore"
          checked={selectedOption === 'firestore'}
          onChange={handleOptionChange}
        />
        <label htmlFor="firestore">Firestore</label>
      </div>

      <button onClick={handleLoadData} disabled={loading}>
        {loading ? 'Loading...' : 'Load Data'}
      </button>

      {/* New button for bulk data upload */}
      <button onClick={handleBulkUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Bulk Data'}
      </button>

      <div>
        <h2>Fetched Songs:</h2>
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              <strong>ID:</strong> {song.id}<br />
              <strong>Artist:</strong> {song.artist_name}<br />
              <strong>Track Name:</strong> {song.track_name}<br />
              <strong>Release Date:</strong> {song.release_date}<br />
              <strong>Genre:</strong> {song.genre}<br />
              <strong>Topic:</strong> {song.topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DatabaseSelector;
