function updateGridLayout() {
    let width = window.innerWidth;
    let newColumns = 12; // Default PC
    let gridElement = document.querySelector('.grid-stack');

    if (width < 768) { 
        newColumns = 1;
        gridElement.classList.remove("gs-6");
        gridElement.classList.add("gs-1");
    } else if (width >= 768 && width < 1024) { 
        newColumns = 6;
        gridElement.classList.remove("gs-1");
        gridElement.classList.add("gs-6");
    } else {
        gridElement.classList.remove("gs-1", "gs-6");
    }

    grid.batchUpdate();
    grid.column(newColumns);
    grid.commit();
}

window.addEventListener('resize', updateGridLayout);
updateGridLayout();
