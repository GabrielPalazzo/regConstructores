import React, { useState } from 'react'
import { Popover, Button } from 'antd';
import { Input } from 'antd';

const { TextArea } = Input;


class ObservationPopOver extends React.Component {
	state = {
		visible: false,
	};

	hide = () => {
		this.setState({
			visible: false,
		});
	};

	handleVisibleChange = visible => {
		this.setState({ visible });
	};

	render() {
		return (
			<Popover
				content={<div>
					<div className="w-full">
						<label className="font-bold text-sm">Indique la Observacion del campo</label>
					</div>
					<div className="w-full">
						<label className="font-bold text-sm">Indique la Observacion del campo</label>
					</div>

					<div className="w-full">
						<Button type="primary" onClick={this.hide}>Guradar</Button>

					</div>

				</div>
				}
				trigger="click"
				visible={this.state.visible}
				onVisibleChange={this.handleVisibleChange}
			>


			</Popover>
		);
	}
}
