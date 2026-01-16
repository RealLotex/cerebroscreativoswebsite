async function loadSharedContent() {
  try {
      const response = await fetch('landpage.html');
      const data = await response.text();
      document.getElementById('texto-compartido').innerHTML = data;

      window.dispatchEvent(new CustomEvent('contenidoCompartidoCargado'));
  } catch (error) {
      console.error('Error loading the shared file:', error);
  }
}

// Run the function
loadSharedContent();
