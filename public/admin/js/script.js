const boxFilter = document.querySelector("[box-filter]");
if (boxFilter) {
  let url = new URL(location.href); // Nhân bản url

  // Filter
  // Bắt sự kiện onChange
  boxFilter.addEventListener("change", () => {
    const value = boxFilter.value;

    if (value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }

    location.href = url.href;
  })
  // End filter

  // Hiển thị lựa chọn mặc định
  const statusCurrent = url.searchParams.get("status");
  if (statusCurrent) {
    boxFilter.value = statusCurrent;
  }
  // End hiển thị mặc định

  // Search 
  const formSearch = document.querySelector("[form-search]");
  if (formSearch) {
    let url = new URL(location.href); // Nhân bản url

    formSearch.addEventListener("submit", (event) => {
      event.preventDefault(); // Ngăn chặn hành vi mặc định: submit form
      const value = formSearch.keyword.value;

      if (value) {
        url.searchParams.set("keyword", value); 
      } else {
        url.searchParams.delete("keyword");
      }

      location.href = url.href;
    });

    // Hiển thị từ khóa mặc định
    const valueCurrent = url.searchParams.get("keyword");
    if (valueCurrent) {
      formSearch.keyword.value = valueCurrent;
    }
  }
  // End search 

}


