import installExtension, {
    REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';

export const installExtensions = async () => {
    const extensions = [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS];

    return extensions.map((extension) =>
        installExtension(extension)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err))
    );
};
