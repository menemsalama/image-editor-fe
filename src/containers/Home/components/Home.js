import React from 'react';
import { SketchPicker } from 'react-color';

import styles from './Home.module.scss';

export class Home extends React.Component {
  get ctx() {
    return this.canvas.current.getContext('2d');
  }

  constructor(props) {
    super(props);

    this.state = {
      color: '#000',
      image: null,
      lineWidth: 1,
    };

    this.canvas = React.createRef();
    this.isDrawing = false;
    this.prevX = 0;
    this.prevY = 0;
  }

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const image = URL.createObjectURL(file);
      this.setState({ image });
    }
  };

  handleColorChangeComplete = (color) => {
    this.setState({ color: color.hex });
  };

  getMousePosition = (e) => {
    const canvas = this.canvas.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      X: (e.clientX - rect.left) * scaleX,
      Y: (e.clientY - rect.top) * scaleY,
    };
  };

  handleStartDrawing = (e) => {
    const { X, Y } = this.getMousePosition(e);
    this.prevX = X;
    this.prevY = Y;
    this.isDrawing = true;
  };

  handleCanvasDrawing = (e) => {
    const { X, Y } = this.getMousePosition(e);

    if (this.isDrawing) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.prevX, this.prevY);
      this.ctx.lineTo(X, Y);
      this.ctx.lineWidth = this.state.lineWidth;
      this.ctx.strokeStyle = this.state.color;

      this.ctx.stroke();
      this.ctx.closePath();
    }

    this.prevX = X;
    this.prevY = Y;
  };

  handleEndDrawing = () => {
    this.isDrawing = false;
  };

  handleLineWidthChange = (e) => {
    const lineWidth = e.target.value;

    if (lineWidth >= 1 || lineWidth <= 10) {
      this.setState({
        lineWidth: e.target.value,
      });
    }
  };

  render() {
    return (
      <div className={styles.container}>
        <header className={styles.homeHeader}>Image Editor</header>

        <section className={styles.settings}>
          <input
            multiple={false}
            type="file"
            accept="image/*"
            onChange={this.handleImageChange}
          />

          <div className={styles.chooseLineWidth}>
            choose line width between 1-10:
            <input
              type="number"
              min={1}
              max={10}
              value={this.state.lineWidth}
              onChange={this.handleLineWidthChange}
            />
          </div>

          <div className={styles.colorPicker}>
            Choose drawer color
            <SketchPicker
              color={this.state.color}
              onChangeComplete={this.handleColorChangeComplete}
            />
          </div>
        </section>

        <section className={styles.drawingArea}>
          <div>
            <img src={this.state.image} alt="User image" />
            <canvas
              width={1600}
              height={1200}
              ref={this.canvas}
              onMouseDown={this.handleStartDrawing}
              onMouseMove={this.handleCanvasDrawing}
              onMouseOut={this.handleEndDrawing}
              onMouseUp={this.handleEndDrawing}
            />
          </div>
        </section>

        <section className={styles.rightMenu}>
          <div></div>
        </section>
      </div>
    );
  }
}
