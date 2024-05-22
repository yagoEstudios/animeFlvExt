document.addEventListener('DOMContentLoaded', () => {
    const animeListElement = document.getElementById('anime-list');
    const borrarTodoButton = document.getElementById('borrarTodo');
    const exportarAnimesButton = document.getElementById('exportarAnimes');
    const importarAnimesInput = document.getElementById('importarAnimes');
  
    // Mostrar la lista de animes y episodios almacenados
    chrome.storage.local.get({ animes: [] }, (data) => {
      const animes = data.animes;
  
      if (animes.length === 0) {
        animeListElement.innerHTML = '<p>No se ha detectado ningún anime.</p>';
      } else {
        animeListElement.innerHTML = ''; // Limpiar contenido inicial
  
        animes.forEach(anime => {
          const animeElement = document.createElement('div');
          animeElement.classList.add('anime');
          animeElement.innerHTML = `
            <h3>${anime.name}</h3>
            <p>Ultimo episodio visitado: ${anime.lastEpisode}</p>
          `;
          animeListElement.appendChild(animeElement);
        });
      }
    });
  
    // Agregar evento al botón de borrar todo
    borrarTodoButton.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres borrar todos los animes?')) {
        chrome.storage.local.remove('animes', () => {
          animeListElement.innerHTML = '<p>No se ha detectado ningún anime.</p>';
        });
      }
    });
  
    // Agregar evento al botón de exportar
    exportarAnimesButton.addEventListener('click', () => {
      chrome.storage.local.get({ animes: [] }, (data) => {
        const animes = data.animes;
        const jsonAnimes = JSON.stringify(animes);
  
        const blob = new Blob([jsonAnimes], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'animes.json';
        document.body.appendChild(a);
        a.click();
  
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      });
    });
  
    // Agregar evento al input de importar
    importarAnimesInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        try {
          const parsedAnimes = JSON.parse(content);
  
          chrome.storage.local.set({ animes: parsedAnimes }, () => {
            // Actualizar la lista de animes en la página
            animeListElement.innerHTML = ''; // Limpiar contenido inicial
  
            parsedAnimes.forEach(anime => {
              const animeElement = document.createElement('div');
              animeElement.classList.add('anime');
              animeElement.innerHTML = `
                <h3>${anime.name}</h3>
                <p>Ultimo episodio visitado: ${anime.lastEpisode}</p>
              `;
              animeListElement.appendChild(animeElement);
            });
          });
  
          alert('Animes importados correctamente.');
        } catch (error) {
          alert('Error al importar el archivo JSON.');
          console.error(error);
        }
      };
  
      reader.readAsText(file);
    });
  });
  