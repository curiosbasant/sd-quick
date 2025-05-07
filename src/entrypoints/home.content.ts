export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/Default.aspx'],
  main() {
    // Prevent annoying login page always being opening in new tab
    document
      .querySelectorAll('.loginMenu .dropdown-item')
      .forEach((a) => a.removeAttribute('target'))
  },
})
