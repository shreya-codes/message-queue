import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const socket = io.connect('http://localhost:4001');

function App() {
	const [message, setMessage] = useState([]);
	useEffect(() => {
		socket.on('message', (msg) => {
			setMessage((message) => [...message, msg]);
			console.log(message);
		});
	}, [message]);

	return (
		<div className='App'>
			<h3>message</h3>
			<TableContainer>
				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>message</TableCell>
							<TableCell>TimeStamp</TableCell>
							<TableCell>Priority</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{message.length !== 0 &&
							message.map((msg, index) => {
								return (
									<TableRow key={index}>
										<TableCell>{msg.msg}</TableCell>
										<TableCell>{msg.timeStamp}</TableCell>
										<TableCell>{msg.priority}</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default App;
