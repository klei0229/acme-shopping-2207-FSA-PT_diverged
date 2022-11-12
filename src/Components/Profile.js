import React, { useEffect, useState, Fragment } from 'react';
import { updateAuth } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, TextField } from '@mui/material';
import UpdateAddress from './UpdateAddress';
import CreateAddress from './CreateAddress';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

const Profile = () => {
	const { auth } = useSelector((state) => state);
	const [el, setEl] = useState(null);
	const [data, setData] = useState('');
	const dispatch = useDispatch();
	const [addresses, setAddresses] = useState([]);
	const [user, setUser] = useState({
		username: auth.username,
		firstName: auth.firstName,
		lastName: auth.lastName,
		email: auth.email,
		avatar: auth.avatar,
	});

	const onChange = (ev) => {
		setUser({ ...user, [ev.target.name]: ev.target.value });
	};

	useEffect(() => {
		if (el) {
			el.addEventListener('change', (ev) => {
				const file = ev.target.files[0];
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.addEventListener('load', () => {
					setData(reader.result);
				});
			});
		}
		if (auth) {
			setAddresses(auth.addresses);
		}
	}, [auth, el, addresses]);

	const saveUser = async (ev) => {
		ev.preventDefault();
		const newAuth = {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			avatar: data,
		};
		try {
			await dispatch(updateAuth(newAuth));
			el.value = '';
			setData('');
		} catch (ex) {
			console.log(ex.response.data);
		}
	};
	return (
		<div>
			<Fragment>
				<Typography variant='h6' gutterBottom>
					Profile
				</Typography>
				<form onSubmit={saveUser}>
					<Grid container spacing={3} style={{ padding: '0 20px' }}>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								name='username'
								label='Username'
								variant='standard'
								fullWidth
								value={user.username}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								name='firstName'
								label='First Name'
								variant='standard'
								fullWidth
								value={user.firstName}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								name='lastName'
								label='Last Name'
								variant='standard'
								fullWidth
								value={user.lastName}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								name='email'
								label='Email'
								variant='standard'
								fullWidth
								value={user.email}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<label>Upload a user photo: </label>
							<input type='file' ref={(x) => setEl(x)} />
						</Grid>
					</Grid>
					<button>Update Your Profile</button>
				</form>
				<img src={data} />
			</Fragment>
			<br />
			<Grid container spacing={3} style={{ padding: '0 20px' }}>
				{addresses.map((_address) => (
					<Grid item key={_address.id} xs={12}>
						<p>{_address.name}</p>
					</Grid>
				))}
			</Grid>
			<br />
			<CreateAddress />
		</div>
	);
};

export default Profile;
