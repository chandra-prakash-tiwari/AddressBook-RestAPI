import * as React from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Dialog, DialogTitle, DialogActions } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { contactService } from "../Services/ContactService";
import "../Styles/home.css";

class ContactDetails {
  contacts: Array<any>;
  addDialog: boolean;
  contact: Contact;
  formEdit: boolean;
  editID: string;
  meta: ContactMeta;
  confirmDialog: boolean;
  id: number;

  constructor() {
    this.contacts = [];
    this.addDialog = false;
    this.contact = new Contact();
    this.formEdit = false;
    this.editID = "";
    this.meta = new ContactMeta();
    this.confirmDialog = false;
    this.id = 0;
  }
}

class Contact {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;

  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.mobile = "";
    this.address = "";
  }
}

class ContactMeta {
  firstNameError: string;
  lastNameError: string;
  emailError: string;
  mobileError: string;
  addressError: string;

  constructor() {
    this.firstNameError = "";
    this.lastNameError = "";
    this.emailError = "";
    this.mobileError = "";
    this.addressError = "";
  }
}

export default class Home extends React.Component<{}, ContactDetails> {
  constructor(props: ContactDetails) {
    super(props);
    this.state = new ContactDetails();
  }

  componentDidMount = () => {
    contactService.getAllContacts().then((res) => {
      if (res !== undefined) {
        this.setState({ contacts: res.value });
      }
    });
  };

  onChanges = (event: any) => {
    this.setState({
      ...this.state,
      contact: {
        ...this.state.contact,
        [event.target.name]: event.target.value,
      },
    });
  };

  onAddNewContact = () => {
    this.setState({ addDialog: true });
    this.setState({ contact: new Contact() });
  };

  onCloseDialog = () => {
    this.setState({ addDialog: false });
  };

  onRefresh = () => {
    contactService.getAllContacts().then((res) => {
      if (res !== undefined) {
        this.setState({ contacts: res.value });
      }
    });
  };

  onEdit = (i: any) => {
    console.log(this.state.contacts[i]);
    this.setState({ addDialog: true });
    this.setState({ formEdit: true });
    this.state.contact.firstName = this.state.contacts[i].FirstName;
    this.state.contact.lastName = this.state.contacts[i].LastName;
    this.state.contact.mobile = this.state.contacts[i].Mobile;
    this.state.contact.email = this.state.contacts[i].Email;
    this.state.contact.address = this.state.contacts[i].Address;
    this.setState({ contact: this.state.contact });
    this.setState({ editID: this.state.contacts[i].ID });
  };

  onSubmit = () => {
    let isValidFirstName = this.isValidFirstName(this.state.contact.firstName);
    let isValidLastName = this.isValidLastName(this.state.contact.lastName);
    let isValidMobileNumber = this.isValidMobileNumber(
      this.state.contact.mobile
    );
    let isValidEmail = this.isValidEmail(this.state.contact.email);
    if ( isValidFirstName && isValidLastName && isValidMobileNumber && !isValidEmail ) {
      this.state.formEdit
        ? contactService
            .editContact(this.state.contact, this.state.editID)
            .then((res) => {
              if (res === "Ok") {
                this.setState({ addDialog: false });
                window.location.reload();
                this.setState({ contact: new Contact() });
              }
            })
        : contactService.addNewContact(this.state.contact).then((res) => {
            if (res === "Ok") {
              this.setState({ addDialog: false });
              window.location.reload();
              this.setState({ contact: new Contact() });
            }
          });
    }
  };

  onDelete = (id: any) => {
    this.setState({ id: id });
    this.setState({ confirmDialog: true });
  };

  onDeleteConfirmationApprove = () => {
    contactService.deleteContact(this.state.id).then((res) => {
      console.log(res);
      if (res === "Ok") window.location.reload();
      this.setState({ confirmDialog: false });
    });
  };

  onDeleteConfirmationReject = () => {
    this.setState({ confirmDialog: false });
  };

  isEmpty(value: string) {
    return !value || (value && value.trim().length === 0);
  }

  isValid(value: string, regex: RegExp) {
    return !value.match(regex);
  }

  isValidMobileNumber(value: string) {
    let emptyStatus = !this.isEmpty(value);
    this.state.contact.mobile=value;
    this.setState({contact:this.state.contact})
    let isValidExp = !this.isValid(value, /^[6789]\d{9}$/);
    this.state.meta.mobileError = !emptyStatus
      ? "Required"
      : !isValidExp
      ? "Invalid"
      : "";
    this.setState({ ...this.state, meta: this.state.meta });
    return emptyStatus && isValidExp;
  }

  isValidFirstName(value: string) {
    let emptyStatus = !this.isEmpty(value);
    let isValidExp = !this.isValid(value, /^[a-zA-Z ]*$/);
    this.state.meta.firstNameError = !emptyStatus
      ? "Required"
      : !isValidExp
      ? "Invalid"
      : "";
    this.setState({ meta: this.state.meta });
    return emptyStatus && isValidExp;
  }

  isValidLastName(value: string) {
    let emptyStatus = !this.isEmpty(value);
    let isValidExp = !this.isValid(value, /^[a-zA-Z ]*$/);
    this.state.meta.lastNameError = !emptyStatus ? "Required" : !isValidExp ? "Invalid" : "";
    this.setState({ meta: this.state.meta });
    return emptyStatus && isValidExp;
  }

  isValidEmail(value: string) {
    let emptyStatus = this.isEmpty(value);
    if (!emptyStatus) {
      let isValidExp = !this.isValid(
        value,
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      );
      this.state.meta.emailError = !isValidExp ? "Invalid" : "";
      this.setState({ meta: this.state.meta });
      return !isValidExp;
    }
    this.state.meta.emailError = emptyStatus ? "Required" : "";
    this.setState({ meta: this.state.meta });
    return emptyStatus;
  }

  render() {
    const dialog1 = (
      <Dialog
        open={this.state.addDialog}
        fullScreen
        className="confirm-dialog"
        style={{ width: "70%", margin: "auto", height: "80%" }}
      >
        <Form>
          <div style={{ textAlignLast: "end" }}>
            <Close onClick={this.onCloseDialog} style={{ cursor: "pointer" }} />
          </div>
          <Form.Group>
            <Form.Label>First name</Form.Label>
            <Form.Control
              className='text'
              type="text"
              value={this.state.contact.firstName}
              name="firstName"
              onChange={(event) => {
                this.onChanges(event);
                this.isValidFirstName(event.target.value);
              }}
            />
            <Form.Text className="error">
              {this.state.meta.firstNameError}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Last name</Form.Label>
            <Form.Control
              className='text'
              type="text"
              value={this.state.contact.lastName}
              name="lastName"
              onChange={(event) => {
                this.onChanges(event);
                this.isValidLastName(event.target.value);
              }}
            />
            <Form.Text className="error">
              {this.state.meta.lastNameError}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              className='email'
              type="text"
              value={this.state.contact.email}
              name="email"
              onChange={(event) => {
                this.onChanges(event);
                this.isValidEmail(event.target.value);
              }}
            />
            <Form.Text className="error">
              {this.state.meta.emailError}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              value={this.state.contact.mobile}
              name="mobile"
              onChange={(event) => {
                this.onChanges(event);
                this.isValidMobileNumber(event.target.value);
              }}
            />
            <Form.Text className="error">
              {this.state.meta.mobileError}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              className='text'
              type="text"
              value={this.state.contact.address}
              name="address"
              onChange={this.onChanges}
            />
          </Form.Group>
          <div className="button">
            <Button onClick={this.onSubmit} className="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Dialog>
    );

    const dialog2 = (
      <Dialog open={this.state.confirmDialog} className="confirm-dialog">
        <DialogTitle>Do you want to delete this contact</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => this.onDeleteConfirmationReject()}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => this.onDeleteConfirmationApprove()}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );

    const details =
      this.state.contacts.length > 0
        ? this.state.contacts.map((contact: any, i: any) => (
            <tr key={i}>
              <td className="word">{contact.FirstName}</td>
              <td className="word">{contact.LastName}</td>
              <td className="email">{contact.Email}</td>
              <td>{contact.Mobile}</td>
              <td className="word">{contact.Address}</td>
              <td>
                <Button onClick={(event: any) => this.onEdit(i)}>Edit</Button>
                {"  "}
                <Button onClick={() => this.onDelete(contact.ID)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))
        : "";

    return (
      <div className="home">
        <header className="header">Contacts</header>
        <Button
          variant="primary"
          onClick={this.onAddNewContact}
          className="head-button"
        >
          Add Contact
        </Button>
        {"  "}
        <Button
          variant="primary"
          onClick={this.onRefresh}
          className="head-button"
        >
          Refresh
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{details}</tbody>
        </Table>
        {dialog1}
        {dialog2}
      </div>
    );
  }
}
