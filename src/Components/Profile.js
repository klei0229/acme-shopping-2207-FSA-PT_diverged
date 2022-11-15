import React, { useEffect, useState, Fragment } from 'react';
import { updateAuth } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, TextField } from '@mui/material';
import UpdateAddress from './UpdateAddress';
import CreateAddress from './CreateAddress';
import { useSnackbar } from 'notistack';

const Profile = () => {
	const { auth } = useSelector((state) => state);
	const [el, setEl] = useState(null);
	const [data, setData] = useState('');
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const [addresses, setAddresses] = useState([]);
	const [user, setUser] = useState({
		username: auth.username,
		firstName: auth.firstName,
		lastName: auth.lastName,
		email: auth.email,
		avatar: auth.avatar,
	});
	const [error, setError] = useState({});

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
			enqueueSnackbar('You saved changes to your profile!', {
				variant: 'success',
			});
		} catch (ex) {
			setError(ex.response.data);
		}
	};

	let messages = [];
	if (error.errors) {
		messages = error.errors.map((e) => e.message);
	}

	return (
		<div>
			<Fragment>
				<Typography variant='h6' gutterBottom>
					Profile
				</Typography>
				<form onSubmit={saveUser}>
					<ul>
						{messages.map((message) => {
							return (
								<li key={message} className={'error'}>
									{message}
								</li>
							);
						})}
					</ul>
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
			{<CreateAddress />}
			<br />
			{!addresses.length ? null : <UpdateAddress />}
		</div>
	);
};

export default Profile;
