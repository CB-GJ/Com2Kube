import React from "react"
import ReactGA from "react-ga"
import { post } from "axios"
import { Button, Input, Box, Grid, Container } from "@material-ui/core"
import { withTranslation } from "react-i18next"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import FileDownload from "./file-download"
import ScrollTop from "./scrolltop"

const useStyles = () => ({
  root: {
    background: "white",
    borderStyle: "dotted"
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  container: {
    margin: "10px"
  }
})

class FileUpload extends React.Component {
  constructor(props) {
    super(props)
    this.onDrop = (file) => {
      this.setState({ file })
    }
    this.state = {
      file: null,
      posts: [],
      isLoading: true
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
    this.gaEvent = this.gaEvent.bind(this)
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  onFormSubmit(e) {
    const { file } = this.state
    e.preventDefault()
    this.fileUpload(file)
      .then((response) => {
        this.setState({
          posts: response.data,
          isLoading: false
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    this.gaEvent()
  }

  fileUpload(file) {
    const url = "/api/compose"
    // eslint-disable-next-line no-undef
    const formData = new FormData()
    formData.append("compose_file", file)
    const headerOptions = {
      headers: {
        "content-type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*"
      }
    }
    return post(url, formData, headerOptions)
  }

  gaEvent() {
    ReactGA.event({
      category: "Submit",
      action: "Submitted a Docker-Compose File"
    })
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { t } = this.props
    const { isLoading, posts } = this.state
    const classes = useStyles()
    return (
      <div>
        <form
          onSubmit={this.onFormSubmit}
          encType="multipart/form-data"
          className={classes.form}
        >
          <Grid container spacing={0} direction="column" alignItems="center">
            <Input
              id="compose_file"
              type="file"
              name="compose_file"
              required={true}
              onChange={this.onChange}
            />
            <p style={{ color: "#707070", fontSize: "14px" }}>
              {t("index.disclaimer")}
            </p>
            <Box m={2}>
              <Button
                type="submit"
                variant="outlined"
                alt="convert button"
                value="upload"
              >
                {t("fileUpload.submitBtn")}
              </Button>
            </Box>
          </Grid>
          <Container>
            {!isLoading ? (
              <div className={classes.container}>
                <FileDownload posts={posts} />
                <SyntaxHighlighter language="yaml" style={atomDark}>
                  {posts}
                </SyntaxHighlighter>
                <ScrollTop />
              </div>
            ) : (
              // eslint-disable-next-line react/self-closing-comp
              <p></p>
            )}
          </Container>
        </form>
      </div>
    )
  }
}

export default withTranslation()(FileUpload)
