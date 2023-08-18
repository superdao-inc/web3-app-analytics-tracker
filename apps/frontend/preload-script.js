(function (id) {
  if (typeof window !== 'undefined' && !window.sdt) {
    window.sdt = ['page', 'track', 'identify'].reduce(
      (acc, name) => {
        acc[name] = async function (...args) {
          if (!window.sdtQueue) window.sdtQueue = [];
          window.sdtQueue.push({ name, args });
        };

        return acc;
      },
      { id },
    );
  }
})();
