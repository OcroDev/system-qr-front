import { jsPDF } from "jspdf";
import axios from "axios";
import { cm, db } from "./logos";

const printServices = {
  orderReport: async (id) => {
    const URI = `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/orders/report`;
    const CM = "COLEGIO METROPOLITANO",
      DB = "COLEGIO LOS PIRINEOS DON BOSCO",
      userAuth = "LIC. GABRIELA CEDOLIN";

    //FETCHING DATA
    let response = [];
    try {
      response = await axios.post(URI, { id: id });
    } catch (error) {
      console.log(error);
    }
    const orderData = response.data.orderFind;
    //?create table and document data
    let doc_data = {},
      doc_table = [];
    for (let i = 0; i < 1; i++) {
      for (const key in orderData) {
        doc_data.Cantidad = orderData[key].mov_quantity.toString();
        doc_data.Material = orderData[key].p_description;
        doc_data.ID = orderData[key].product_id.toString();
        doc_data.Medida = orderData[key].p_unit;
        doc_table.push(Object.assign({}, doc_data));
      }
    }

    doc_data = {
      id: orderData[0].id.toString(),
      title: "Solicitud de Material",
      date: orderData[0].createdat.substr(0, 10),
      img:
        orderData[0].w_description === CM
          ? cm
          : orderData[0].w_description === DB
          ? db
          : "",
      from: orderData[0].w_description,
      to: "OFICINA CENTRAL ADMINISTRATIVA",
      department: orderData[0].d_name,
      userName: orderData[0].username,
      userAuth: userAuth,
      notes: orderData[0].mov_note,
    };

    function createHeaders(keys) {
      let result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 60,
          height: 20,
          align: "right",
          padding: 0,
        });
      }
      return result;
    }
    const headers = createHeaders(["ID", "Material", "Cantidad", "Medida"]);

    //DOCUMENT
    const doc = new jsPDF();

    //? table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("DETALLES DE LA OPERACION", 100, 50, null, null, "center");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.table(10, 55, doc_table, headers, {
      printHeaders: true,
      autoSize: false,
      headerBackgroundColor: "#efefef",
      headerTextColor: "#363535",
      fontSize: 10,
      css: { border: 2 },
    });
    //? header
    doc.addImage(`${doc_data.img}`, "JPEG", 170, 10, 25, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`${doc_data.title}`, 100, 10, null, null, "center");
    doc.setFontSize(10);
    doc.text(10, 20, `Nro. Reporte: ${doc_data.id}`);
    doc.text(10, 25, `Fecha: ${doc_data.date}`);
    doc.text(10, 30, `De: ${doc_data.from}`);
    doc.text(10, 35, `Para: ${doc_data.to}`);
    doc.text(10, 40, `Dpto: ${doc_data.department}`);
    //?observaciones
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(10, 219, `Observaciones:`);
    doc.setFontSize(8);

    doc.text(12, 225, doc_data.notes);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 220, 190, 20, 0.5, 0.5);
    //? footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(10, 258, `Autorizado por:`);
    doc.setFontSize(10);
    doc.text(11, 265, "Firma:");
    doc.text(12, 275, "____________________________");
    doc.setFontSize(10);
    doc.text(11, 280, `Nombre:`);
    doc.setFontSize(7);
    doc.text(25, 280, `${doc_data.userAuth}`);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 260, 60, 30, 1, 1);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(140, 258, `Recibido por:`);
    doc.setFontSize(10);
    doc.text(141, 265, "Firma:");
    doc.text(142, 275, "____________________________");
    doc.setFontSize(10);
    doc.text(141, 280, `Nombre:`);
    doc.text(141, 287, `Fecha: ____/____/________`);
    doc.setFontSize(7);
    //doc.text(25, 280, `${doc_data.userName} ${doc_data.userLastname}`);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(140, 260, 60, 30, 1, 1);
    //save doc
    doc.save("a4.pdf");
  },
  operationReport: async (type, id) => {
    const URI = `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations/${type}-id`;
    const CM = "COLEGIO METROPOLITANO",
      DB = "COLEGIO LOS PIRINEOS DON BOSCO";
    let minus;
    if (type === "in") {
      minus = 1;
    } else {
      minus = -1;
    }

    //fetching data
    let response = [];
    try {
      response = await axios.post(URI, { id: id });
    } catch (error) {
      console.log(error);
    }
    const operationData = response.data.operation;

    //? create table and document data
    let doc_data = {};
    let doc_table = [];
    for (let i = 0; i < 1; i++)
      for (const key in operationData) {
        // doc_data.id = operationData[key].id.toString();
        doc_data.Cantidad = (
          minus * operationData[key].mov_quantity
        ).toString();
        doc_data.Material = operationData[key].p_description;
        doc_data.Medida = operationData[key].p_unit;
        doc_table.push(Object.assign({}, doc_data));
      }

    doc_data = {
      id: operationData[0].id.toString(),
      title: type === "in" ? "Entrada de materiales" : "Nota de Entrega",
      date: operationData[0].createdat.substr(0, 10),
      img:
        operationData[0].warehouse_in === CM
          ? cm
          : operationData[0].warehouse_in === DB
          ? db
          : "",
      from: "OFICINA CENTRAL ADMINISTRATIVA",
      to:
        type === "out"
          ? operationData[0].warehouse_in
          : "OFICINA CENTRAL ADMINISTRATIVA",
      department: operationData[0].dep_in,
      userName: operationData[0].name,
      userLastname: operationData[0].lastname,
      userAuth: operationData[0].operation_auth,
    };

    function createHeaders(keys) {
      let result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 80,
          height: 20,
          align: "right",
          padding: 0,
        });
      }
      return result;
    }
    const headers = createHeaders(["Material", "Cantidad", "Medida"]);

    //DOCUMENT
    const doc = new jsPDF();

    //? table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("DETALLES DE LA OPERACION", 100, 50, null, null, "center");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.table(10, 55, doc_table, headers, {
      printHeaders: true,
      autoSize: false,
      headerBackgroundColor: "#efefef",
      headerTextColor: "#363535",
      fontSize: 10,
      css: { border: 2 },
    });
    //? header
    doc.addImage(`${doc_data.img}`, "JPEG", 170, 10, 25, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`${doc_data.title}`, 100, 10, null, null, "center");
    doc.setFontSize(10);
    doc.text(10, 20, `Nro. Reporte: ${doc_data.id}`);
    doc.text(10, 25, `Fecha: ${doc_data.date}`);
    doc.text(10, 30, `De: ${doc_data.from}`);
    doc.text(10, 35, `Para: ${doc_data.to}`);
    doc.text(10, 40, `Dpto: ${doc_data.department}`);

    //? footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(10, 258, `Despachado por:`);
    doc.setFontSize(10);
    doc.text(11, 265, "Firma:");
    doc.text(12, 275, "____________________________");
    doc.setFontSize(10);
    doc.text(11, 280, `Nombre:`);
    doc.setFontSize(7);
    doc.text(25, 280, `${doc_data.userName} ${doc_data.userLastname}`);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 260, 60, 30, 1, 1);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(75, 258, `Autorizado por:`);
    doc.setFontSize(10);
    doc.text(76, 265, "Firma:");
    doc.text(77, 275, "____________________________");
    doc.setFontSize(10);
    doc.text(76, 280, `Nombre:`);
    doc.setFontSize(7);
    doc.text(90, 280, `${doc_data.userAuth}`);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(75, 260, 60, 30, 1, 1);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(140, 258, `Recibido por:`);
    doc.setFontSize(10);
    doc.text(141, 265, "Firma:");
    doc.text(142, 275, "____________________________");
    doc.setFontSize(10);
    doc.text(141, 280, `Nombre:`);
    doc.text(141, 287, `Fecha: ____/____/________`);
    doc.setFontSize(7);
    //doc.text(25, 280, `${doc_data.userName} ${doc_data.userLastname}`);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(140, 260, 60, 30, 1, 1);
    //save doc
    type === "in" ? doc.save("Entrada.pdf") : doc.save("Nota de Entrega");
  },
  productReport: async () => {
    //fetching data
    let response,
      products = [];
    try {
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products`
      );
    } catch (error) {
      console.log(error.message);
    }
    products = response.data.allProducts;

    function createHeaders(keys) {
      let result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 60,
          height: 20,
          align: "left",
          padding: 0,
        });
      }
      return result;
    }
    const headers = createHeaders([
      "Creado",
      "Nombre",
      "Existencia",
      "Medida",
      "Ubicacion",
    ]);

    const doc = new jsPDF();

    let doc_data = {};
    let result = [];
    for (let i = 0; i < 1; i++)
      for (const key in products) {
        //doc_data.ID = products[key].id.toString();
        doc_data.Nombre = products[key].p_description;
        doc_data.Existencia = products[key].p_stock.toString();
        doc_data.Creado = products[key].createdat.substr(0, 10);
        doc_data.Medida = products[key].p_unit;
        doc_data.Ubicacion = products[key].p_ubication;
        result.push(Object.assign({}, doc_data));
      }

    doc_data = {
      title: "Reporte de Materiales en el Inventario",
      date: new Date().toLocaleDateString(),
      totalProduct: result.length.toString(),
    };

    //? header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`${doc_data.title}`, 10, 20);
    doc.setFontSize(10);
    doc.setDrawColor(0);
    doc.setFillColor(235, 235, 235);
    doc.roundedRect(10, 35, 190, 10, 1, 1, "F");
    doc.text(12, 41, `Fecha de Reporte: ${doc_data.date}`);
    doc.text(80, 41, `Total de materiales: ${doc_data.totalProduct}`);
    //DATA Table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Resumen de inventario`, 100, 60, null, null, "center");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.table(20, 65, result, headers, {
      printHeaders: true,
      autoSize: true,
      headerBackgroundColor: "#efefef",
      headerTextColor: "#363535",
      fontSize: 10,
      css: { border: 2 },
    });
    doc.save("a4.pdf");
  },
  print: () => {
    window.print();
  },
  productMinStock: async () => {
    //fetching data
    let response,
      products = [];
    try {
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products/minstock`
      );
    } catch (error) {
      console.log(error.message);
    }
    products = response.data.products;

    function createHeaders(keys) {
      let result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 60,
          height: 20,
          align: "left",
          padding: 0,
        });
      }
      return result;
    }
    const headers = createHeaders([
      "Creado",
      "Nombre",
      "Existencia",
      "Medida",
      "Ubicacion",
    ]);

    const doc = new jsPDF();

    let doc_data = {};
    let result = [];
    for (let i = 0; i < 1; i++)
      for (const key in products) {
        //doc_data.ID = products[key].id.toString();
        doc_data.Nombre = products[key].p_description;
        doc_data.Existencia = products[key].p_stock.toString();
        doc_data.Creado = products[key].createdat.substr(0, 10);
        doc_data.Medida = products[key].p_unit;
        doc_data.Ubicacion = products[key].p_ubication;
        result.push(Object.assign({}, doc_data));
      }

    doc_data = {
      title: "Materiales en existencia mínima",
      date: new Date().toLocaleDateString(),
      totalProduct: result.length.toString(),
    };

    //? header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`${doc_data.title}`, 10, 20);
    doc.setFontSize(10);
    doc.setDrawColor(0);
    doc.setFillColor(235, 235, 235);
    doc.roundedRect(10, 35, 190, 10, 1, 1, "F");
    doc.text(12, 41, `Fecha de Reporte: ${doc_data.date}`);
    doc.text(80, 41, `Total de Materiales: ${doc_data.totalProduct}`);
    //DATA Table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Resumen de inventario`, 100, 60, null, null, "center");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.table(20, 65, result, headers, {
      printHeaders: true,
      autoSize: true,
      headerBackgroundColor: "#efefef",
      headerTextColor: "#363535",
      fontSize: 10,
      css: { border: 2 },
    });
    doc.save("a4.pdf");
  },
  productMustOut: async () => {
    //fetching data
    let response,
      products = [];
    try {
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products/mustout`
      );
    } catch (error) {
      console.log(error.message);
    }
    products = response.data.products;

    function createHeaders(keys) {
      let result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 60,
          height: 20,
          align: "left",
          padding: 0,
        });
      }
      return result;
    }
    const headers = createHeaders([
      "Nombre",
      "Veces_Pedido",
      "Cantidad",
      "Medida",
    ]);

    const doc = new jsPDF();

    let doc_data = {};
    let result = [];
    for (let i = 0; i < 1; i++)
      for (const key in products) {
        //doc_data.ID = products[key].id.toString();
        doc_data.Nombre = products[key].p_description;
        doc_data.Veces_Pedido = products[key].total_out;
        doc_data.Medida = products[key].p_unit;
        doc_data.Cantidad = (-1 * products[key].quantity).toString();
        result.push(Object.assign({}, doc_data));
      }

    doc_data = {
      title: "Materiales con mayor salida",
      date: new Date().toLocaleDateString(),
      totalProduct: result.length.toString(),
    };

    //? header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`${doc_data.title}`, 10, 20);
    doc.setFontSize(10);
    doc.setDrawColor(0);
    doc.setFillColor(235, 235, 235);
    doc.roundedRect(10, 35, 190, 10, 1, 1, "F");
    doc.text(12, 41, `Fecha de Reporte: ${doc_data.date}`);
    doc.text(80, 41, `Total de Materiales: ${doc_data.totalProduct}`);
    //DATA Table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Resumen de inventario`, 100, 60, null, null, "center");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.table(20, 65, result, headers, {
      printHeaders: true,
      autoSize: true,
      headerBackgroundColor: "#efefef",
      headerTextColor: "#363535",
      fontSize: 10,
      css: { border: 2 },
    });
    doc.save("a4.pdf");
  },
  printQr: (doc_data) => {
    let $d = document;
    let img;

    img = $d.body.ownerDocument.images;
    let date = new Date().toLocaleDateString("es-ve");
    let title = "Lista de Materiales Qr";
    let imgCounter = 2;

    //? document

    const doc = new jsPDF();
    let setDownSquare = 50,
      setDownProduct = 55,
      setDownStock = 60,
      setDownUbication = 65,
      setDownQrCode = 52,
      pageCounter = 0;

    for (const key in doc_data) {
      //header

      doc.addImage(
        `${img.item(imgCounter).currentSrc}`,
        "JPEG",
        180,
        setDownQrCode,
        15,
        15
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text(`${title}`, 100, 30, null, null, "center");
      //text square
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(12, setDownProduct, `Material: ${doc_data[key].p_description}`);
      doc.text(12, setDownStock, `Existencia: ${doc_data[key].p_stock}`);
      doc.text(12, setDownUbication, `Ubicación: ${doc_data[key].p_ubication}`);
      doc.text(10, 25, `Fecha: ${date}`);
      //square
      doc.setFontSize(8);
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(10, setDownSquare, 190, 20, 0.5, 0.5);
      setDownSquare += 21;
      setDownProduct += 21;
      setDownStock += 21;
      setDownUbication += 21;
      setDownQrCode += 21;
      if (pageCounter === 9) {
        doc.addPage();
        setDownSquare = 50;
        setDownProduct = 55;
        setDownStock = 60;
        setDownUbication = 65;
        setDownQrCode = 52;
        pageCounter = 0;
      }
      pageCounter++;
      imgCounter++;
    }

    var key = 0;
    // for (let i = 0; i < 30; i++, pageCounter++, key++) {

    // }

    doc.save("listadoQR.pdf");
  },
  printOneQr: (doc_data) => {
    doc_data = {
      ...doc_data,
      title: "Qr del Material",
      date: new Date().toLocaleDateString("es-ve"),
    };

    //DOCUMENT
    const doc = new jsPDF();
    //? header
    doc.addImage(`${doc_data.dataImage}`, "JPEG", 180, 52, 15, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`${doc_data.title}`, 100, 30, null, null, "center");
    doc.setFontSize(10);
    //?observaciones
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(12, 55, `Material: ${doc_data.name}`);
    doc.text(12, 60, `Existencia: ${doc_data.stock}`);
    doc.text(12, 65, `Ubicación: ${doc_data.ubication}`);

    doc.text(10, 25, `Fecha: ${doc_data.date}`);
    doc.setFontSize(8);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 50, 190, 20, 0.5, 0.5);
    doc.save("MaterialQR.pdf");
  },

  printOutQr: (doc_data) => {
    doc_data = {
      ...doc_data,
      title: "Etiqueta de salida QR",
      date: new Date().toLocaleDateString("es-ve"),
    };

    const doc = new jsPDF({ orientation: "l", format: [210, 100] });
    //? header
    doc.addImage(`${doc_data.dataImg}`, "JPEG", 180, 52, 15, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`${doc_data.title}`, 100, 30, null, null, "center");
    doc.setFontSize(10);
    //?observaciones
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(12, 55, `Colegio: ${doc_data.warehouse}`);
    doc.text(12, 60, `Departamento: ${doc_data.department}`);
    // doc.text(12, 65, `Ubicación: ${doc_data.ubication}`);

    doc.text(10, 25, `Fecha: ${doc_data.date}`);
    doc.setFontSize(8);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 50, 190, 20, 0.5, 0.5);
    doc.save("SalidaQR.pdf");
  },
};

export default printServices;
