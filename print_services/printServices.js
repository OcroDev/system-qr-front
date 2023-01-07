import { jsPDF } from "jspdf";
import axios from "axios";
import { cm, db } from "./logos";

const printServices = {
  operationReport: async (type, id) => {
    const URI = `http://localhost:5000/qrstock/api/operations/${type}-id`;
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
      console.log(first);
    }
    const operationData = response.data.operation;

    console.log(operationData);

    //? create table and document data
    let doc_data = {};
    let doc_table = [];
    for (let i = 0; i < 1; i++)
      for (const key in operationData) {
        // doc_data.id = operationData[key].id.toString();
        doc_data.Cantidad = (
          minus * operationData[key].mov_quantity
        ).toString();
        doc_data.Producto = operationData[key].p_description;
        doc_data.Medida = operationData[key].p_unit;
        doc_table.push(Object.assign({}, doc_data));
      }

    doc_data = {
      id: operationData[0].id.toString(),
      title: type === "in" ? "Entrada de productos" : "Nota de Entrega",
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
    console.log(doc_data);

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
    const headers = createHeaders(["Producto", "Cantidad", "Medida"]);

    //DOCUMENT
    const doc = new jsPDF();

    //? table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("DETALLES DE LA OPERACION", 100, 50, null, null, "center");
    doc.setFont("courier", "normal");
    doc.table(10, 55, doc_table, headers, {
      printHeaders: true,
    });
    //? header
    doc.addImage(`${doc_data.img}`, "JPEG", 170, 10, 25, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(22);
    doc.text(`${doc_data.title}`, 100, 10, null, null, "center");
    doc.setFontSize(12);
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
    doc.save("a4.pdf");
  },
  productReport: async () => {
    const createDocument = (product) => {
      const doc = new jsPDF();

      let data = {};
      let result = [];
      for (let i = 0; i < 1; i++)
        for (const key in product) {
          console.log(product[key].id);
          data.id = product[key].id.toString();
          data.p_description = product[key].p_description;
          data.p_stock = product[key].p_stock;
          result.push(Object.assign({}, data));
        }

      doc.table(5, 5, result, ["id", "p_description", "p_stock"], {
        printHeaders: true,
      });
      doc.save("a4.pdf");
    };
  },
  print: () => {
    window.print();
  },
};

export default printServices;
