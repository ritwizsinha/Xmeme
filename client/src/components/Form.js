import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '80%',
        },
    },
    header: {
        margin: theme.spacing(2, 0, 2, 0)
    },
    container: {
        width: '80%',
        padding: theme.spacing(1, 1, 1, 1),
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center'
    },
    formContainer: {

    },
    imagePreview: {
        width: '50%',
        height: '300px',
    }
}));

export const Form = () => {
    const classes = useStyles();
    const [user, setUser] = useState('');
    const [url, setUrl] = useState('');
    const [caption, setCaption] = useState('');
    console.log(user, url, caption);
    const showImage = () => {
        if (url) {
            return (
                <div style={{
                    margin: '30px 0',
                }}>
                    <img src={url} alt='Invalid' width={200} height={200}/>
                </div>
            )
        }
        return;
    }
    return (
        <div className={classes.container}>
            <div className={classes.formContainer}>
                <div className={classes.header}>
                    <Typography variant="h4" component="h5">
                        Post your meme
                </Typography>
                </div>

                <form className={classes.root} noValidate autoComplete="off" >
                    <TextField
                        id="standard-name-input"
                        label="Name"
                        type="text"
                        defaultValue={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <TextField
                        id="standard-url"
                        label="Add Image Url"
                        type="url"
                        defaultValue={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <TextField
                        id="standard-name-input"
                        label="Add caption"
                        type="text"
                        defaultValue={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </form>
            </div>
            <div className={classes.imagePreview}>
                {showImage()}
            </div>
        </div>
    )
}