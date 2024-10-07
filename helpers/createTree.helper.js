const createTree = (array, parentId = "") => { // sử dụng đệ quy
    const newArray = [];

    for (const item of array) {
        if (item.parent_id == parentId) {
            const children = createTree(array, item.id);
            if (children.length > 0) {
                item.children = children; // tạo thêm field children 
            }
            newArray.push(item); // lưa vào mảng ban đầu 
        }
    }

    return newArray; // trả về mảng ban đầu hoặc mảng con 
}


module.exports.getAllCategory = (array, parentId = "") => {
    const tree = createTree(array, parentId);
    return tree;
}

