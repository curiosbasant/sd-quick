// Prevent annoying login page always being opening in new tab
document.querySelectorAll('.loginMenu .dropdown-item').forEach((a) => a.removeAttribute('target'))
