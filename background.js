chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      const urlPattern = /^https:\/\/www3\.animeflv\.net\/ver\/([a-z0-9\-]+)-([0-9]+)$/;
      const match = tab.url.match(urlPattern);
  
      if (match) {
        const animeName = match[1].replace(/-/g, ' ');
        const episodeNumber = match[2];
  
        // Obtener la lista actual de animes almacenados
        chrome.storage.local.get({ animes: [] }, (data) => {
          let existingAnimes = data.animes;
  
          // Verificar si el anime ya está almacenado
          let animeIndex = existingAnimes.findIndex(anime => anime.name === animeName);
          if (animeIndex === -1) {
            // Anime no encontrado, agregarlo a la lista
            existingAnimes.push({ name: animeName, lastEpisode: episodeNumber });
          } else {
            // Anime encontrado, actualizar el último episodio visitado
            existingAnimes[animeIndex].lastEpisode = episodeNumber;
          }
  
          // Guardar la lista actualizada de animes
          chrome.storage.local.set({ animes: existingAnimes });
        });
      }
    }
  });
  