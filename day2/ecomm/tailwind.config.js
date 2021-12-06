module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        backgroundColor: (theme) => ({
            ...theme('colors'),
            'background-clr': '#EFF0F6',
            white: '#f7f7ff',
            blue: '#e1f0fe',
            purple: '#6B00F5',
            pink: 'rgba(233,121,178,0.2)',
            glacier: 'rgba(215, 215, 249, 0.2)',
            green: 'rgba(120,247,187,0.2)',
        }),
        textColor: (theme) => ({
            ...theme('colors'),
            purple: '#6B00F5',
        }),
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
