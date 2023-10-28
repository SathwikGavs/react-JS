import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
 
function App() {
  const [data, setData] = useState([]);
  const [listVisible, setListVisible] = useState(false);
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [emailid, setEmail] = useState('');
 
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
 
  const updateUserId = (event) => {
    setUserId(event.target.value);
  }
 
  const updatePassword = (event) => {
    setPassword(event.target.value);
  }
 
  const updateEmail = (event) => {
    setEmail(event.target.value);
  }
 
  useEffect(() => {
    fetchUsersData();
  }, []);
 
  const insertUser = (event) => {
    event.preventDefault();
    if (isUpdating) {
      // If isUpdating is true, it's an update operation
      axios.put(`http://localhost:9901/update`, {
        uid: selectedUserId,
        password: password,
        emailid: emailid
      })
        .then((res) => {
          console.log(res);
          setIsUpdating(false); // Reset the update mode
          setSelectedUserId(null);
          clearForm();
          fetchUsersData();
        })
        .catch((error) => {
          console.error('Update error:', error);
        });
    } else {
      // If isUpdating is false, it's an insert operation
      axios.post("http://localhost:9901/insert", {
        uid: userid,
        password: password,
        emailid: emailid
      })
        .then((res) => {
          console.log(res);
          clearForm();
          fetchUsersData();
        })
        .catch((error) => {
          console.error('Insert error:', error);
        });
    }
  }
 
  const deleteUser = (uid) => {
    axios.delete(`http://localhost:9901/delete?uid=${uid}`)
      .then((response) => {
        console.log('Delete response:', response.data);
        fetchUsersData();
      })
      .catch((error) => {
        console.error('Delete error:', error);
      });
  };
 
  const updateUser = (uid) => {
    const selectedUser = data.find((user) => user.userid === uid);
    if (selectedUser) {
      setIsUpdating(true);
      setSelectedUserId(selectedUser.userid);
      setUserId(selectedUser.userid);
      setPassword(selectedUser.password);
      setEmail(selectedUser.emailid);
    }
  };
 
  const clearForm = () => {
    setUserId('');
    setPassword('');
    setEmail('');
  };
 
  const fetchUsersData = () => {
    fetch("http://localhost:9901/getAll")
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);
      });
  }
 
  return (
    <div className="App">
      <form onSubmit={insertUser}>
       <h1>React-Express</h1>
        <b>User ID</b><input type="text" value={userid} onChange={updateUserId} /><br />
        <b>Password</b><input type="password" value={password} onChange={updatePassword} /><br />
        <b>Email</b><input type="email" value={emailid} onChange={updateEmail} /><br />
        <input type="submit" value={isUpdating ? "Update" : "Add"} />&nbsp;&nbsp;
        <input type="reset" value="Reset" />
      </form>
      <button onClick={() => setListVisible(!listVisible)}>User List</button>
      {listVisible && (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Password</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.userid}</td>
                <td>{item.password}</td>
                <td>{item.emailid}</td>
                <td>
                  <button onClick={() => deleteUser(item.userid)}>Delete</button>
                  <button onClick={() => updateUser(item.userid)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
 
export default App;

















































































































/*

import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [emailid, setEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const updateUserId = (event) => {
    setUserId(event.target.value);
  }

  const updatePassword = (event) => {
    setPassword(event.target.value);
  }

  const updateEmail = (event) => {
    setEmail(event.target.value);
  }

  const insertUser = (event) => {
    event.preventDefault();
    axios.post("http://localhost:9901/insert", { uid: userid, password: password, emailid: emailid })
      .then(res => {
        console.log(res);
        setUserId('');
        setPassword('');
        setEmail('');
        refreshData();
      })
      .catch(error => console.error(error));
  }

  const updateUser = () => {
    if (selectedUser) {
      axios.put(`http://localhost:9901/update/${selectedUser.id}`, { uid: userid, password: password, emailid: emailid })
        .then(res => {
          console.log(res);
          setUserId('');
          setPassword('');
          setEmail('');
          setSelectedUser(null);
          refreshData();
        })
        .catch(error => console.error(error));
    }
  }

  const deleteUser = (user) => {
    axios.delete(`http://localhost:9901/delete?uid=${user.uid}`)
      .then(res => {
        console.log(res);
        refreshData();
      })
      .catch(error => console.error(error));
  }

  const selectUserForUpdate = (user) => {
    setUserId(user.uid);
    setPassword(user.password);
    setEmail(user.emailid);
    setSelectedUser(user);
  }

  const refreshData = () => {
    axios.get("http://localhost:9901/getAll")
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }

  return (
    <div className="App">
      <form onSubmit={insertUser}>
        <b>User ID</b><input type="text" value={userid} onChange={updateUserId} /><br />
        <b>Password</b><input type="password" value={password} onChange={updatePassword} /><br />
        <b>Email</b><input type="email" value={emailid} onChange={updateEmail} /><br />
        {selectedUser ? (
          <>
            <button onClick={updateUser}>Update User</button>
            <button onClick={() => deleteUser(selectedUser)}>Delete User</button>
          </>
        ) : (
          <input type="submit" value="Add" />
        )}&nbsp;&nbsp;
        <input type="reset" value="Reset" />
      </form>
      <div>
        <h2>Users Data</h2>
        <ul>
          {data.map(user => (
            <li key={user.id}>
              {user.uid} - {user.emailid}
              <button onClick={() => selectUserForUpdate(user)}>Update</button>
              <button onClick={() => deleteUser(user)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;



*/




































































































/*

import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]); // Initialize data state
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [emailid, setEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // To track the selected user for updating

  useEffect(() => {
    // Fetch data from the API and update the data state
    axios.get("http://localhost:9901/getAll")
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const updateUserId = (event) => {
    setUserId(event.target.value);
  }

  const updatePassword = (event) => {
    setPassword(event.target.value);
  }

  const updateEmail = (event) => {
    setEmail(event.target.value);
  }

  const insertUser = (event) => {
    event.preventDefault();
    axios.post("http://localhost:9901/insert", { uid: userid, password: password, emailid: emailid })
      .then(res => {
        console.log(res);
        // Clear the input fields after submitting
        setUserId('');
        setPassword('');
        setEmail('');
        // Fetch updated data
        axios.get("http://localhost:9901/getAll")
          .then(response => setData(response.data))
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }

  const updateUser = () => {
    if (selectedUser) {
      // Send a request to update the selected user
      axios.put(`http://localhost:9901/update/${selectedUser.id}`, { uid: userid, password: password, emailid: emailid })
        .then(res => {
          console.log(res);
          // Clear the input fields after updating
          setUserId('');
          setPassword('');
          setEmail('');
          setSelectedUser(null);
          // Fetch updated data
          axios.get("http://localhost:9901/getAll")
            .then(response => setData(response.data))
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
  }

  const selectUserForUpdate = (user) => {
    setUserId(user.uid);
    setPassword(user.password);
    setEmail(user.emailid);
    setSelectedUser(user);
  }

  return (
    <div className="App">
      <form onSubmit={insertUser}>
        <b>User ID</b><input type="text" value={userid} onChange={updateUserId} /><br />
        <b>Password</b><input type="password" value={password} onChange={updatePassword} /><br />
        <b>Email</b><input type="email" value={emailid} onChange={updateEmail} /><br />
        {selectedUser ? (
          <button onClick={updateUser}>Update User</button>
        ) : (
          <input type="submit" value="Add" />
        )}&nbsp;&nbsp;
        <input type="reset" value="Reset" />
      </form>
     // { Display the fetched data and provide an option to update users } 
     // <div>
       // <h2>Users Data</h2>
       // <ul>
        //  {data.map(user => (
          //  <li key={user.id}>
            //  {user.uid} - {user.emailid}
             // <button onClick={() => selectUserForUpdate(user)}>Update</button>
           // </li>
         // ))}
       // </ul>
      //</div>
 //   </div>
 // );
//}

//export default App;


























































/*

import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios  from 'axios';


 
function App(response) {

  const [usersData, setUsersData]=useState([]);
  
    }


  


  useEffect(()=>{
    fetch("http://localhost:9901/getAll").then(response => response.json()).
    then((data) => console.log(data));
  });

    const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [emailid, setemailId] = useState('');
  const updateUserId=(event)=>
  {
    setUserId (event.target.value);
  }
  const updatepassword=(event)=>
  {
    setPassword(event.target.value);
  }
  const updateEmail=(event)=>
  {
    setemailId(event.target.value);
  }
  const insertUser=(event)=>
  {
    event.preventDefault();
    axios.post('http://localhost:9901/insert', {userid:userid, password:password, emailid:emailid})
    .then((res) => 
      console.log(res));

  }

  return (
    <div className="App">
      <center>
      <form>
        <b>User ID</b><input type="text" value={userid} onChange={updateUserId}/><br/>
        <b>Password</b><input type="password" value={password} onChange={updatepassword}/><br/>
        <b>Email ID</b><input type="email" value={emailid} onChange={updateEmail}/><br/>
        <input type="submit" value="Add" /> &nbsp;&nbsp;
        <input type="reset" value ="Reset"/>
      </form></center>

        

      
    </div>
  );
  }

export default App;


*/



/*

//task 
import React, { useEffect, useState } from "react";

function App() {
  const [userData, setUserData] = useState(null);

  const fetchData = () => {
    fetch("http://localhost:9901/getAll")
      .then((response) => response.json())
      .then((data) => setUserData(data));
  };

  return (
    <center>
    <div className="App">
      <button onClick={fetchData}>Fetch User Data</button>
      {userData ? (
        <div>
          <h2>User Data:</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      ) : (
        <p></p>
      )}
    </div>
    </center>
  );
}

export default App;

*/
